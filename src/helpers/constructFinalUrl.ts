import { BASE_API_URL } from "@/configs/constants";

const constructFinalUrl = (endpoint: string) => `${BASE_API_URL ?? ""}/${endpoint}`;

export default constructFinalUrl;