import {beforeEachProviders, it, describe, expect, inject} from '@angular/core/testing';
import {LoginPage} from './login';
 
describe('Login', () => {
 
    it('LoginUser', () => {
 
        expect(true).toBeTruthy();
        expect(1 + 1).toBe(2);
        expect(2 + 2).toBe(5); //this will fail
 
    });
 
});