export async function hello(greeting) {
  const { Logger } = await import('./logger');
  new Logger().log('hai ', greeting);
}
