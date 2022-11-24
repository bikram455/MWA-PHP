import { environment } from "src/environments/environment";

export const isObjectEmpty = (data: Object) => {
    return Object.keys(data).length === environment.zero;
}