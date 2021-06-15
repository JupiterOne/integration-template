## Notes on test/config.ts

Config.ts is designed to support the ability to run tests with local variables
stored in the .env file, or with dummy variables on Github CI/CD. During
development, run `yarn test:env` to execute tests using the variables in the
.env file on your local machine.

To see the tests run as they will on Github, run `yarn test:ci`. Tests will run
using the dummy variables in config.ts. Authentication will fail unless
recordings are in place.

## Notes on test/recording.ts

Recording.ts is designed to make recordings of the API responses using Polly, so
that CI/CD tests using dummy variables can pass. When the tests run, if there is
no recording, Polly records the API responses, mutates them according to
parameters in recording.ts, and then saves that file. In the future, if the same
URL is called, Polly will use the saved response instead of going to the real
API.

Once you are ready to record, you can uncomment the recording lines in your test
files and run your tests with your local .env variables using `yarn test:env`.
That will record authenticated responses. After that, `yarn test:ci` will pass
using dummy variables.

This is great, but requires some security considerations so that secrets
returned from the API do not end up in the Polly recordings. The basic recording
settings in recording.ts will handle zipped responses, and redact cookies and
Authorization headers in the request.

However, there is a good chance that something more sophisticated will be
needed. Many APIs return secrets in the content of the response, which means it
is necessary to unzip that content, parse it, and modify the properties of
returned objects before saving them in the recording. You can see a commented
version of a more sophistcated redaction routine in recording.ts.

Once recording is enabled, but _BEFORE_ committing the recording files via git,
examine the recording file(s) for secrets. Then modify recording.ts accordingly,
delete the recording file(s), and record again. Repeat until you have a clean
recording to commit to git.

If you commit a dirty recording, your git history will still have the secrets
even if you fix them in a later commit. Bad actors know this and regularly scan
git history. Therefore, if you acccidentally commit a dirty recording, it will
require modification of your git history.
