export default function ScopedFactory(scopeName?: string, ...args: Function[]): (target: Function, key: string, index: number) => void;
