export const ProviderConfTemplate = `{
    "version": "1.0",
    "runtimeMap": {
        "node": "mdsCloud",
        "python": "mdsCloud"
    },
    "providers": {
        "mdsCloud": {
            "type": "{{providerType}}",
            "baseUrl": "{{providerUrl}}"
        }
    }
}
`;
