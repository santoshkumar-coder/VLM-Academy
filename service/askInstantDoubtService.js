import AskInstantDoubt from "../model/askInstantDoubt.js";

export const createDoubtService = async (data) => {
  return await AskInstantDoubt.create(data);
};