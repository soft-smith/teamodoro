import fastify from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

interface PomodoroTimer {
  id: string;
  title: string;
  duration: number;
  timeLeft: number;
  timerId: NodeJS.Timeout | null;
  status: "RUNNING" | "PAUSED" | "STOPPED";
}

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

export type GetPomodoroTimerRequestType = Static<
  typeof GetPomodoroTimerRequest
>;

interface Team {
  id: string;
  name: string;
  timerList: PomodoroTimer[];
}

export const CreateTeamRequest = Type.Object({
  name: Type.String(),
});
export type CreateTeamRequestType = Static<typeof CreateTeamRequest>;

export const CreateTimerRequest = Type.Object({
  title: Type.String(),
  duration: Type.Number(),
});

export type CreateTimerRequestType = Static<typeof CreateTimerRequest>;

export const createApp = () => {
  const teamList: Team[] = [];

  const app = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

  app.get("/", async () => {
    return { hello: "world" };
  });

  app.post<{
    Body: CreateTeamRequestType;
  }>(
    "/team/create",
    {
      schema: {
        body: CreateTeamRequest,
      },
    },
    async (request) => {
      const team: Team = {
        ...request.body,
        id: "1",
        timerList: [],
      };
      teamList.push(team);
      return {
        data: team,
      };
    }
  );

  app.get<{
    Params: {
      "teamId": string;
    };
  }>("/team/:teamId/timer/list", async (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
    if (!team) {
      throw new Error("Team not found");
    }
    return {
      data: team.timerList,
    };
  });

  app.post<{
    Params: {
      "teamId": string;
    };
    Body: CreateTimerRequestType;
  }>("/team/:teamId/timer/create", async (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
    if (!team) {
      throw new Error("Team not found");
    }
    const timer: PomodoroTimer = {
      ...request.body,
      id: "1",
      status: "PAUSED",
      timeLeft: request.body.duration,
      timerId: null,
    };
    team.timerList.push(timer);
    return {
      data: timer,
    };
  });

  app.get<{
    Params: {
      "teamId": string;
      "timerId": string;
    };
  }>("/team/:teamId/timer/:timerId", async (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
    if (!team) {
      throw new Error("Team not found");
    }
    const timer = team.timerList.find(
      (timer) => timer.id === request.params["timerId"]
    );
    if (!timer) {
      throw new Error("Timer not found");
    }
    return {
      data: timer,
    };
  });

  // pause timer
  app.post<{
    Params: {
      "teamId": string;
      "timerId": string;
    };
  }>("/team/:teamId/timer/:timerId/pause", async (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
    if (!team) {
      throw new Error("Team not found");
    }
    const timer = team.timerList.find(
      (timer) => timer.id === request.params["timerId"]
    );
    if (!timer) {
      throw new Error("Timer not found");
    }
    timer.status = "PAUSED";
    return {
      data: timer,
    };
  });

  // resume or start timer
  app.post<{
    Params: {
      "teamId": string;
      "timerId": string;
    };
  }>("/team/:teamId/timer/:timerId/start", async (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
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
    return {
      data: timer,
    };
  });

  // delete timer
  app.delete<{
    Params: {
      "teamId": string;
      "timerId": string;
    };
  }>("/team/:teamId/timer/:timerId", async (request) => {
    const team = teamList.find((team) => team.id === request.params["teamId"]);
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
    return {
      data: "OK",
    };
  });

  return app;
};
