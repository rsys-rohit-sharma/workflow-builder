// commitlint.config.js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-case': [0],
        'jira-ticket-in-scope': [2, 'always'],
    },
    parserPreset: {
        parserOpts: {
            issuePrefixes: ['SHSD-'],
        },
    },
    plugins: [
        {
            rules: {
                'jira-ticket-in-scope': ({ header }) => {
                    const jiraTicketPattern = /\((JIRA|SHSD)-\d+\)/;
                    return [
                        jiraTicketPattern.test(header),
                        `Commit message must contain a valid JIRA ticket ID in the format (JIRA-123) or (SHSD-123)`,
                    ];
                },
            },
        },
    ],
};
