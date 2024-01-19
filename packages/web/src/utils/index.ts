export default {
  time: {
    pad(t: number) {
      return t.toString().padStart(2, '0');
    },
    format(seconds: number) {
      const formattedSegments = [];
      const hours = Math.floor(seconds / 3600);
      if (hours > 0) {
        formattedSegments.push(hours);
      }
      formattedSegments.push(Math.floor((seconds % 3600) / 60));
      formattedSegments.push(seconds % 60);
      return formattedSegments.map((s) => this.pad(s)).join(':');
    },
  },
} as const;
