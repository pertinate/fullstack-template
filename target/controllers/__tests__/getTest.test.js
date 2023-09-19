"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("mock_payloads/src");
var getTest_1 = require("../getTest");
var tap_1 = __importDefault(require("tap"));
tap_1.default.same((0, getTest_1.testGet)(), src_1.responses.GET['/'].happy_path);
