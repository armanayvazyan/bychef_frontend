import { IDishInfo } from "@/types";
import dish from "@/assets/dish.png";
import chef from "@/assets/chef.jpeg";

export const REDIRECT_PATH = "/";
export const PATHS = [];
export const PROTECTED_PATHS = [];
export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const SB_KEY = import.meta.env.VITE_SB_KEY;
export const YMAP_KEY = import.meta.env.VITE_YMAP_KEY;
export const IDRAM_ORDER_ID_PREFIX = import.meta.env.VITE_IDRAM_ORDER_ID_URL_PREFIX;
export const YMAP_SEARCH_RESULTS_COUNT = import.meta.env.VITE_YMAP_SEARCH_RESULTS_COUNT;

export const chefInfo = {
  name: "Լիլիթ Ստեփանյան",
  businessName: "Լիլիթ Ստեփանյան Kitchen",
  img: chef,
  workingDays: [1, 2, 4, 0],
  about: "Լորեմ Իպսումը տպագրության և տպագրական արդյունաբերության համար նախատեսված մոդելային տեքստ է։ Սկսած 1500-ականներից՝ Լորեմ Իպսումը հանդիսացել է տպագրական արդյունաբերության ստանդարտ մոդելային տեքստ...",
  dishes: ["healthy food", "healthy food", "healthy food"]
};

export const chefs = [
  {
    id: 2,
    name: "Alice",
    businessName: "Alice Kitchen",
    img: chef,
    dishes: ["healthy food", "salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert"],
  },
  ...(new Array(20).fill({
    id: 1,
    name: "Alice",
    businessName: "Alice Kitchen",
    img: chef,
    dishes: ["healthy food", "salads", "fish", "meat", "desert"],
  }))
];

export const dishes = [
  {
    id: Math.random().toString(),
    name: "kololak",
    isAvailable: true,
    isVegan: true,
    img: dish,
    price: 1000,
    ingredients: ["tomato", "egg", "beef"],
    options: [{ id: 1, question: "Ավելացնել կծու՞" }],
    notices: [{ key: "orderDaysAhead", time: 3 }],
    dishes: ["salads", "fish", "meat", "desert", "healthy food", "salads", "fish", "meat", "desert"],
  },
  {
    id: Math.random().toString(),
    name: "kololak",
    isAvailable: true,
    isVegan: true,
    img: dish,
    price: 1000,
    ingredients: ["tomato", "egg", "beef"],
    options: [{ id: 1, question: "Ավելացնել կծու՞" }, { id: 2, question: "Ավելացնել կծու՞" }, { id: 3, question: "Ավելացնել կծու՞" }],
    notices: [{ key: "orderHoursAhead", time: 4 }],
    dishes: ["healthy food", "salads", "fish", "meat", "desert"],
  },
  {
    id: Math.random().toString(),
    name: "kololak",
    isAvailable: true,
    isVegan: true,
    img: dish,
    price: 1000,
    ingredients: ["tomato", "egg", "beef"],
    options: [{ id: 1, question: "Ավելացնել կծու՞" }, { id: 2, question: "Ավելացնել կծու՞" }, { id: 3, question: "Ավելացնել կծու՞" }],
    notices: [{ key: "orderDaysAhead", time: 5 }],
    dishes: ["healthy food", "salads", "fish", "meat", "desert"],
  },
  {
    id: Math.random().toString(),
    name: "kololak",
    isAvailable: true,
    isVegan: true,
    img: dish,
    price: 1000,
    ingredients: ["tomato", "egg", "beef"],
    options: [{ id: 1, question: "Ավելացնել կծու՞" }, { id: 2, question: "Ավելացնել կծու՞" }, { id: 3, question: "Ավելացնել կծու՞" }],
    notices: [{ key: "orderHoursAhead", time: 6 }],
    dishes: ["healthy food", "salads", "fish", "meat", "desert"],
  }
] as IDishInfo[];