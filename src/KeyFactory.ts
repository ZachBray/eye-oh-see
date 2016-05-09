export default class KeyFactory {
  private static nextId = 0;

  public static create(factory) {
    const name = factory.name || factory;
    const id = ++KeyFactory.nextId;
    return `${name}_${id}`;
  }
}
