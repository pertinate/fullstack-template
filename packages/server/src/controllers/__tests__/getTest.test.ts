import { responses } from 'mock_payloads/src';
import { testGet } from '../getTest';
import tap from 'tap';

tap.same(testGet(), responses.GET['/'].happy_path);
