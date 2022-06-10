// Copyright (C) AuthTS Contributors
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

/**
 * Fake state store implementation necessary for validating refresh token requests.
 *
 * @internal
 */
export class RefreshState {
    /** custom "state", which can be used by a caller to have "data" round tripped */
    public readonly data: unknown | undefined;

    public readonly refresh_token: string;
    public readonly id_token?: string;
    public readonly session_state: string | null;
    public readonly scope?: string;

    constructor(args: {
        refresh_token: string;
        id_token?: string;
        session_state: string | null;
        scope?: string;
        state?: unknown;
    }) {
        this.refresh_token = args.refresh_token;
        this.id_token = args.id_token;
        this.session_state = args.session_state;
        this.scope = args.scope;
        this.data = args.state;
    }
}
