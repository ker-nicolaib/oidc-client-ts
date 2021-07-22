// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { UserInfoService } from '../../src/UserInfoService';
import { MetadataService } from '../../src/MetadataService';

import { StubJsonService } from './StubJsonService';

describe("UserInfoService", () => {
    let subject: UserInfoService;
    let metadataService: MetadataService;
    let stubJsonService: any;

    beforeEach(() => {
        const settings: any = {};
        stubJsonService = new StubJsonService();
        // @ts-ignore
        subject = new UserInfoService(settings, () => stubJsonService);

        // access private member
        metadataService = subject["_metadataService"];
    });

    describe("getClaims", () => {

        it("should return a promise", async () => {
            // act
            var p = subject.getClaims();

            // assert
            expect(p).toBeInstanceOf(Promise);
            p.catch(_e => {});
        });

        it("should require a token", async () => {
            // act
            try {
                await subject.getClaims();
                fail("should not come here");
            } catch (err) {
                expect(err.message).toContain("token");
            }
        });

        it("should call userinfo endpoint and pass token", async () => {
            // arrange
            jest.spyOn(metadataService, "getUserInfoEndpoint").mockImplementation(() => Promise.resolve("http://sts/userinfo"));
            stubJsonService.result = Promise.resolve("test");

            // act
            await subject.getClaims("token");

            // assert
            expect(stubJsonService.url).toEqual("http://sts/userinfo");
            expect(stubJsonService.token).toEqual("token");
        });

        it("should fail when dependencies fail", async () => {
            // arrange
            jest.spyOn(metadataService, "getUserInfoEndpoint").mockRejectedValue(new Error("test"));

            // act
            try {
                await subject.getClaims("token");
                fail("should not come here");
            } catch (err) {
                expect(err.message).toContain("test");
            }
        });

        it("should return claims", async () => {
            // arrange
            jest.spyOn(metadataService, "getUserInfoEndpoint").mockImplementation(() => Promise.resolve("http://sts/userinfo"));
            const expectedClaims = {
                foo: 1, bar: 'test',
                aud:'some_aud', iss:'issuer',
                sub:'123', email:'foo@gmail.com',
                role:['admin', 'dev'],
                nonce:'nonce', at_hash:"athash",
                iat:5, nbf:10, exp:20
            }
            stubJsonService.result = Promise.resolve(expectedClaims);

            // act
            const claims = await subject.getClaims("token");

            // assert
            expect(claims).toEqual(expectedClaims);
        });
    });
});
