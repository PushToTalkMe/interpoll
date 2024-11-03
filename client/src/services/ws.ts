import { Dispatch, useEffect } from "react";
import { io } from "socket.io-client";
import { PollI } from "../interfaces/api.interface";
import { SOCKET_SERVER_URL } from "../constants";

export const usePollSocket = (
  setPolls: Dispatch<React.SetStateAction<PollI[]>>
) => {
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    const handleUpdatePoll = (data: PollI) => {
      setPolls((polls) =>
        polls.map((poll) => (poll.id === data.id ? data : poll))
      );
    };

    const handleDeletePoll = (id: number) => {
      setPolls((polls) => polls.filter((poll) => poll.id !== id));
    };

    const handleCreatePoll = (data: PollI) => {
      setPolls((polls) => {
        return [data, ...polls];
      });
    };

    socket.on("updatePoll", handleUpdatePoll);
    socket.on("deletePoll", handleDeletePoll);
    socket.on("createPoll", handleCreatePoll);

    return () => {
      socket.off("updatePoll", handleUpdatePoll);
      socket.off("deletePoll", handleDeletePoll);
      socket.off("createPoll", handleCreatePoll);
    };
  }, [setPolls]);
};
