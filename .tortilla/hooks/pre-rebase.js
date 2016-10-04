/*
  Pre-rebase git hook launches right before we rebase a branch. If an error was thrown
  the rebase process will be aborted with the provided error message.
 */

(function () {
  if (!process.env.TORTILLA_CHILD_PROCESS) throw Error(
    'Rebase mode is prohibited! Use `$ npm step -- edit` instead'
  )
})();