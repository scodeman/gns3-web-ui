import { Link } from "../../../../models/link";

export interface LinkStrategy {
    d(link: Link): string;
}
