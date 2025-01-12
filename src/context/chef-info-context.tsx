import { createContext } from "react";
import { IChefInfo } from "@/types";

const ChefInfoContext = createContext({} as { info?: IChefInfo, error: any, isLoading: boolean });

export default ChefInfoContext;