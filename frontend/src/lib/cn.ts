export function cn(...classes: Array<string | false | null | undefined>) {
  // Drop empty values so components can add classes conditionally.
  return classes.filter(Boolean).join(' ');
}
