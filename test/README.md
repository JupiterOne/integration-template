## Notes on `test/config.ts`

`test/config.ts` is designed to support the ability to run tests with local
variables stored in the `.env` file, or with dummy variables on Github CI/CD.
During development, run `yarn test:env` to execute tests using the variables in
the `.env` file on your local machine.

To see the tests run as they will during CI/CD, run `yarn test:ci`. Tests will
run using the dummy variables in `test/config.ts`. Authentication will fail
unless recordings are in place.

## Notes on `test/recording.ts`

`test/recording.ts` is designed to make recordings of the API responses using
Polly, so that CI/CD tests using dummy variables can pass. When the tests run,
if there is no recording, Polly records the API responses, mutates them
according to parameters in `test/recording.ts`, and then saves that information
as a `.har` file in a directory called `__recordings__`. In the future, if the
same URL is called, Polly will use the saved response instead of going to the
real API. (This behavior can be tweaked. See Advanced Polly options below).

Once you are ready to record, you can uncomment the recording lines in your test
files and run your tests with your local `.env` variables using `yarn test:env`.
That will record authenticated responses. After that, `yarn test:ci` will pass
using dummy variables.

This is great, but requires some security considerations so that secrets
returned from the API do not end up in the Polly recordings. The basic recording
settings in `test/recording.ts` will handle zipped responses, and redact cookies
and Authorization headers in the request.

However, there is a good chance that something more sophisticated will be
needed. Many APIs return secrets in the content of the response, which means it
is necessary to unzip that content, parse it, and modify the properties of
returned objects before saving them in the recording. You can see a commented
version of a more sophisticated redaction routine in `test/recording.ts`.

Once recording is enabled, but _BEFORE_ committing the recording files via git,
examine the recording file(s) for secrets. Then modify `test/recording.ts`
accordingly, delete the recording file(s), and record again. Repeat until you
have a clean recording to commit to git.

If you commit a dirty recording, your git history will still have the secrets
even if you fix them in a later commit. Bad actors know this and regularly scan
git history. Therefore, if you acccidentally commit a dirty recording, it will
require modification of your git history.

## Advanced Polly options

Polly matches a URL request to a recording via a guid. By default, the guid is
generated considering the whole URL (including for example any query parameters)
plus the header properties sent and how many times that URL has been called in
this recording session.

For many situations, this will work just fine, but there are occasions where you
need to modify what Polly looks at in generating the guid. You can do this by
passing Polly options to your recording setup function in `test/recording.ts`.
For example:

```ts
setupRecording({
  ...input,
  redactedRequestHeaders: ['Authorization'],
  redactedResponseHeaders: ['set-cookie'],
  mutateEntry: (entry) => {
    redact(entry);
  },
  options: {
    matchRequestsBy: {
      headers: false,
      order: false,
    },
  },
});
```

Here is everything Polly uses by default to generate the guid:

```ts
matchRequestsBy: {
  method: true,
  headers: true,
  body: true,
  order: true,
  url: {
    protocol: true,
    username: true,
    password: true,
    hostname: true,
    port: true,
    pathname: true,
    query: true,
    hash: false
  }
}
```

Even more detail can be found here:
https://github.com/Netflix/pollyjs/blob/master/docs/configuration.md
