"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@stablelib+wipe@1.0.1";
exports.ids = ["vendor-chunks/@stablelib+wipe@1.0.1"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n// Copyright (C) 2016 Dmitry Chestnykh\n// MIT License. See LICENSE file for details.\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n/**\n * Sets all values in the given array to zero and returns it.\n *\n * The fact that it sets bytes to zero can be relied on.\n *\n * There is no guarantee that this function makes data disappear from memory,\n * as runtime implementation can, for example, have copying garbage collector\n * that will make copies of sensitive data before we wipe it. Or that an\n * operating system will write our data to swap or sleep image. Another thing\n * is that an optimizing compiler can remove calls to this function or make it\n * no-op. There's nothing we can do with it, so we just do our best and hope\n * that everything will be okay and good will triumph over evil.\n */\nfunction wipe(array) {\n    // Right now it's similar to array.fill(0). If it turns\n    // out that runtimes optimize this call away, maybe\n    // we can try something else.\n    for (var i = 0; i < array.length; i++) {\n        array[i] = 0;\n    }\n    return array;\n}\nexports.wipe = wipe;\n//# sourceMappingURL=wipe.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzdGFibGVsaWIrd2lwZUAxLjAuMS9ub2RlX21vZHVsZXMvQHN0YWJsZWxpYi93aXBlL2xpYi93aXBlLmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2I7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWiIsInNvdXJjZXMiOlsiRDpcXE11bHRpQWdlbnRXcml0ZXJ6XFxub2RlX21vZHVsZXNcXC5wbnBtXFxAc3RhYmxlbGliK3dpcGVAMS4wLjFcXG5vZGVfbW9kdWxlc1xcQHN0YWJsZWxpYlxcd2lwZVxcbGliXFx3aXBlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDE2IERtaXRyeSBDaGVzdG55a2hcbi8vIE1JVCBMaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlIGZvciBkZXRhaWxzLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqXG4gKiBTZXRzIGFsbCB2YWx1ZXMgaW4gdGhlIGdpdmVuIGFycmF5IHRvIHplcm8gYW5kIHJldHVybnMgaXQuXG4gKlxuICogVGhlIGZhY3QgdGhhdCBpdCBzZXRzIGJ5dGVzIHRvIHplcm8gY2FuIGJlIHJlbGllZCBvbi5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCB0aGlzIGZ1bmN0aW9uIG1ha2VzIGRhdGEgZGlzYXBwZWFyIGZyb20gbWVtb3J5LFxuICogYXMgcnVudGltZSBpbXBsZW1lbnRhdGlvbiBjYW4sIGZvciBleGFtcGxlLCBoYXZlIGNvcHlpbmcgZ2FyYmFnZSBjb2xsZWN0b3JcbiAqIHRoYXQgd2lsbCBtYWtlIGNvcGllcyBvZiBzZW5zaXRpdmUgZGF0YSBiZWZvcmUgd2Ugd2lwZSBpdC4gT3IgdGhhdCBhblxuICogb3BlcmF0aW5nIHN5c3RlbSB3aWxsIHdyaXRlIG91ciBkYXRhIHRvIHN3YXAgb3Igc2xlZXAgaW1hZ2UuIEFub3RoZXIgdGhpbmdcbiAqIGlzIHRoYXQgYW4gb3B0aW1pemluZyBjb21waWxlciBjYW4gcmVtb3ZlIGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gb3IgbWFrZSBpdFxuICogbm8tb3AuIFRoZXJlJ3Mgbm90aGluZyB3ZSBjYW4gZG8gd2l0aCBpdCwgc28gd2UganVzdCBkbyBvdXIgYmVzdCBhbmQgaG9wZVxuICogdGhhdCBldmVyeXRoaW5nIHdpbGwgYmUgb2theSBhbmQgZ29vZCB3aWxsIHRyaXVtcGggb3ZlciBldmlsLlxuICovXG5mdW5jdGlvbiB3aXBlKGFycmF5KSB7XG4gICAgLy8gUmlnaHQgbm93IGl0J3Mgc2ltaWxhciB0byBhcnJheS5maWxsKDApLiBJZiBpdCB0dXJuc1xuICAgIC8vIG91dCB0aGF0IHJ1bnRpbWVzIG9wdGltaXplIHRoaXMgY2FsbCBhd2F5LCBtYXliZVxuICAgIC8vIHdlIGNhbiB0cnkgc29tZXRoaW5nIGVsc2UuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpXSA9IDA7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbn1cbmV4cG9ydHMud2lwZSA9IHdpcGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD13aXBlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js\n");

/***/ })

};
;