# Description

Thank you for contributing to a JupiterOne integration!

Please include a summary of the change and which issue is fixed. Please also
include relevant motivation and context. List any dependencies that are required
for this change.

## Summary

<!-- Summary here! -->

## Type of change

Please leave any irrelevant options unchecked.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
      not work as expected)
- [ ] This change requires a documentation update

## Checklist

### General Development Checklist:

- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

### Integration Development Checklist:

Please leave any irrelevant options unchecked.

- [ ] I have checked for additional permissions required to call any new API
      endpoints, and have documented any additional permissions in
      `jupiterone.md`, where necessary.
- [ ] My changes properly paginate the target service provider's API
- [ ] My changes properly handle rate limiting of the target service provider's
      API
- [ ] My new integration step is instrumented to execute in the correct order
      using `dependsOn`
- [ ] I have referred to the
      [JupiterOne data model](https://github.com/JupiterOne/data-model/tree/main/src/schemas)
      to ensure that any new entities/relationships, and relevant properties,
      match the recommended model for this class of data
- [ ] I have updated the `CHANGELOG.md` file to describe my changes
- [ ] When changes include modifications to existing graph data ingestion, I've
      reviewed all existing managed questions referencing the entities,
      relationships, and their property names, to ensure those questions still
      function with my changes.
