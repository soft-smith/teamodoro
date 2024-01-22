import fastify from "fastify";
import cors from "@fastify/cors";
import { Static, Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyWebsocket, { SocketStream } from "@fastify/websocket";
import { Static, Type } from "@sinclair/typebox";
import { PomodoroTimer, Team } from "./types.ts";

const createDtoOfTimer = (timer: PomodoroTimer) => {
  return {
    id: timer.id,
    title: timer.title,
    duration: timer.duration,
    timeLeft: timer.timeLeft,
    status: timer.status,
  };
};

export const GetPomodoroTimerRequest = Type.Object({
  id: Type.String(),
  title: Type.String(),
  duration: Type.Number(),
  timeLeft: Type.Number(),
  status: Type.Union([
    Type.Literal("RUNNING"),
    Type.Literal("PAUSED"),
    Type.Literal("STOPPED"),
  ]),
});

export const CreateTeamRequest = Type.Object({
  name: Type.String(),
});

export const CreateTimerRequest = Type.Object({
  title: Type.String(),
  duration: Type.Number(),
});

export const createApp = () => {
  let idCounter = 0;
  const getId = () => {
    idCounter += 1;
    return idCounter.toString();
  };

  const teamList: Team[] = [];

  const connectionTableByTeamId: { [teamId: string]: SocketStream[] } = {};

  const app = fastify({ logger: true })
    .withTypeProvider<TypeBoxTypeProvider>()
    .register(fastifyWebsocket)
    .register((app) =>
      // handle websocket connection
      app.get<{ Params: { teamId: string } }>(
        "/:teamId",
        { websocket: true },
        (conn, req) => {
          const { teamId } = req.params;

          const team = teamList.find((team) => team.id === teamId);
          if (!team) {
            conn.socket.close(4000, "Team not found");
            return;
          }

          const conns = connectionTableByTeamId[teamId];
          if (!conns) {
            connectionTableByTeamId[teamId] = [conn];
          } else {
            conns.push(conn);
          }

          conn.socket.on("close", (code) => {
            console.log(req.id, `Connection closed with code ${code}`);
            const conns = connectionTableByTeamId[teamId];
            if (!conns) {
              return;
            }
            const index = conns.findIndex((c) => c === conn);
            if (index === -1) {
              return;
            }
            conns.splice(index, 1);
            if (conns.length === 0) {
              delete connectionTableByTeamId[teamId];
            }
          });

          conn.socket.on("message", (msg) => {
            console.log(req.id, msg.toString());
            conn.socket.send("Hello from server");
          });
        }
      )
    );

  app.register(cors, {
    origin: new RegExp(
      process.env.WEB_HOST !== "" || process.env.WEB_HOST !== undefined
        ? `^((http://)|(https://))(.*\\.${process.env.WEB_HOST}|${process.env.WEB_HOST}|localhost|localhost:\\d+)$`
        : ".*"
    ),
  });


  // reset server state
  app.post("/_test/reset", async (request) => {
    teamList.splice(0, teamList.length);
    idCounter = 0;

    teamList.splice(0, teamList.length);

    Object.keys(connectionTableByTeamId).forEach((teamId) => {
      const conns = connectionTableByTeamId[teamId];
      conns.forEach((c) => c.socket.close(4000, "Server reset"));
      delete connectionTableByTeamId[teamId];
    });

    return { data: "OK" };
  });

  // create team
  app.post<{ Body: Static<typeof CreateTeamRequest> }>(
    "/team/create",
    { schema: { body: CreateTeamRequest } },
    (request) => {
      const team: Team = {
        id: getId(),
        name: request.body.name,
        timerList: [],
      };
      teamList.push(team);
      return { data: { id: team.id, name: team.name } };
    }
  );

  // query team
  app.get<{ Params: { teamId: string } }>("/team/:teamId", (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
    if (!team) {
      throw new Error("Team not found");
    }
    return { data: { id: team.id, name: team.name } };
  });

  // query timer list of team
  app.get<{ Params: { teamId: string } }>(
    "/team/:teamId/timer/list",
    (request) => {
      const team = teamList.find(
        (team) => team.id === request.params["teamId"]
      );
      if (!team) {
        throw new Error("Team not found");
      }
      return { data: team.timerList.map(createDtoOfTimer) };
    }
  );

  // create timer
  app.post<{
    Params: { teamId: string };
    Body: Static<typeof CreateTimerRequest>;
  }>("/team/:teamId/timer/create", (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
    if (!team) {
      throw new Error("Team not found");
    }
    const timer: PomodoroTimer = {
      duration: request.body.duration,
      title: request.body.title,
      id: getId(),
      status: "PAUSED",
      timeLeft: request.body.duration,
      timerId: null,
    };
    team.timerList.push(timer);
    return { data: createDtoOfTimer(timer) };
  });

  // query timer of team
  app.get<{ Params: { teamId: string; timerId: string } }>(
    "/team/:teamId/timer/:timerId",
    (request) => {
      const team = teamList.find(
        (team) => team.id === request.params["teamId"]
      );
      if (!team) {
        throw new Error("Team not found");
      }
      const timer = team.timerList.find(
        (timer) => timer.id === request.params["timerId"]
      );
      if (!timer) {
        throw new Error("Timer not found");
      }
      return { data: createDtoOfTimer(timer) };
    }
  );

  // pause timer
  app.post<{ Params: { teamId: string; timerId: string } }>(
    "/team/:teamId/timer/:timerId/pause",
    (request) => {
      const team = teamList.find(
        (team) => team.id === request.params["teamId"]
      );
      if (!team) {
        throw new Error("Team not found");
      }
      const timer = team.timerList.find(
        (timer) => timer.id === request.params["timerId"]
      );
      if (!timer) {
        throw new Error("Timer not found");
      }
      if (timer.timerId) {
        clearInterval(timer.timerId);
        timer.timerId = null;
      }
      timer.status = "PAUSED";
      return { data: createDtoOfTimer(timer) };
    }
  );

  // resume or start timer
  app.post<{ Params: { teamId: string; timerId: string } }>(
    "/team/:teamId/timer/:timerId/start",
    (request) => {
      const team = teamList.find(
        (team) => team.id === request.params["teamId"]
      );
      if (!team) {
        throw new Error("Team not found");
      }
      const timer = team.timerList.find(
        (timer) => timer.id === request.params["timerId"]
      );
      if (!timer) {
        throw new Error("Timer not found");
      }
      if (timer.status === "STOPPED") {
        timer.timeLeft = timer.duration;
      }

      if (timer.timerId === null) {
        timer.timerId = setInterval(() => {
          timer.timeLeft -= 1;
          if (timer.timeLeft === 0) {
            timer.status = "STOPPED";
            clearInterval(timer.timerId!);
            timer.timerId = null;
          }
        }, 1000);
      }

      timer.status = "RUNNING";
      return { data: createDtoOfTimer(timer) };
    }
  );

  // delete timer
  app.post<{ Params: { teamId: string; timerId: string } }>(
    "/team/:teamId/timer/:timerId/delete",
    (request) => {
      const team = teamList.find(
        (team) => team.id === request.params["teamId"]
      );
      if (!team) {
        throw new Error("Team not found");
      }
      const timerIndex = team.timerList.findIndex(
        (timer) => timer.id === request.params["timerId"]
      );
      if (timerIndex === -1) {
        throw new Error("Timer not found");
      }
      team.timerList.splice(timerIndex, 1);
      return { data: "OK" };
    }
  );

  return app;
};
