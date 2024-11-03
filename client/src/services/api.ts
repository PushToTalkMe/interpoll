import { REST_API_SERVER_URL } from "../constants";
import { CustomError } from "../custom/custom-error";
import { CreatePollDto, PollI, VoteDto } from "../interfaces/api.interface";

export const getPolls = async (
  page: number,
  limit: number
): Promise<PollI[]> => {
  const url = `${REST_API_SERVER_URL}/polls?page=${page}&limit=${limit}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new CustomError(error.message, error.statusCode, error.error);
  }

  return response.json();
};

export const createPoll = async (body: CreatePollDto) => {
  const url = `${REST_API_SERVER_URL}/polls`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new CustomError(error.message, error.statusCode, error.error);
  }

  return response.json();
};

export const vote = async (id: number, body: VoteDto) => {
  const url = `${REST_API_SERVER_URL}/polls/${id}/vote`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new CustomError(error.message, error.statusCode, error.error);
  }

  return response.json();
};

export const deletePoll = async (id: number) => {
  const url = `${REST_API_SERVER_URL}/polls/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new CustomError(error.message, error.statusCode, error.error);
  }

  return response.json();
};
