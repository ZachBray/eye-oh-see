export default function InstancePerScope(scopeName: string, ...services: Function[]): (target: Function) => void;
