# Integration with JupiterOne

## {{provider}} + JupiterOne Integration Benefits

- TODO: Iterate the benefits of ingesting data from the provider into JupiterOne. Use an active voice.
- Visualize {{provider}} services, teams, and users in the JupiterOne graph.
- Map {{provider}} users to employees in your JupiterOne account.
- Monitor changes to {{provider}} users using JupiterOne alerts.

## How it Works

- TODO: Update this list as appropriate. Indicate the significant activities the
  integration enables.
- JupiterOne periodically fetches services, teams, and users from {{provider}} to
  update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when JupiterOne graph changes.

## Requirements

- TODO: Update this list as appropriate.
- JupiterOne requires a REST API key.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In {{provider}}

- TODO: Update this list of steps as appropriate. Remove the section when there
  are no steps in the provider.
- [Generate a REST API key](https://example.com/docs/generating-api-keys)

### In JupiterOne

0. TODO: Update this list of steps as appropriate. Include permissions requirements
   when appropriates.
1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **{{provider}}** integration tile and click it.
3. Click the **Add Configuration** button.
4. Enter the **Account Name** by which you'd like to identify this {{provider}}
   account in JupiterOne. Ingested entities will have this value stored in
   `tag.AccountName` when **Tag with Account Name** is checked.
5. Enter a **Description** that will further assist your team when identifying
   the integration instance.
6. Select a **Polling Interval** that you feel is sufficient for your monitoring
   needs. You may leave this as `DISABLED` and manually execute the integration.
7. Enter the **{{provider}} API Key** generated for use by JupiterOne.
8. Click **Create Configuration** once all values are provided.

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **{{provider}}** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources | Entity `_type` | Entity `_class` |
| --------- | -------------- | --------------- |
| Account   | `acme_account` | `Account`       |

### Relationships

The following relationships are created/mapped:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `acme_account`        | **HAS**               | `acme_user`           |
| `acme_account`        | **HAS**               | `acme_group`          |
| `acme_group`          | **HAS**               | `acme_user`           |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
