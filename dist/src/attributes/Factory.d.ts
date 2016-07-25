export default function Factory(...args: Function[]): (target: Function, key: string, index: number) => void;
