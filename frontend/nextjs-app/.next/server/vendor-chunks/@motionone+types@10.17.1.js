"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@motionone+types@10.17.1";
exports.ids = ["vendor-chunks/@motionone+types@10.17.1"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/@motionone+types@10.17.1/node_modules/@motionone/types/dist/MotionValue.es.js":
/*!**************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@motionone+types@10.17.1/node_modules/@motionone/types/dist/MotionValue.es.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MotionValue: () => (/* binding */ MotionValue)\n/* harmony export */ });\n/**\n * The MotionValue tracks the state of a single animatable\n * value. Currently, updatedAt and current are unused. The\n * long term idea is to use this to minimise the number\n * of DOM reads, and to abstract the DOM interactions here.\n */\nclass MotionValue {\n    setAnimation(animation) {\n        this.animation = animation;\n        animation === null || animation === void 0 ? void 0 : animation.finished.then(() => this.clearAnimation()).catch(() => { });\n    }\n    clearAnimation() {\n        this.animation = this.generator = undefined;\n    }\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0Btb3Rpb25vbmUrdHlwZXNAMTAuMTcuMS9ub2RlX21vZHVsZXMvQG1vdGlvbm9uZS90eXBlcy9kaXN0L01vdGlvblZhbHVlLmVzLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrSUFBa0k7QUFDbEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFdUIiLCJzb3VyY2VzIjpbIkQ6XFxNdWx0aUFnZW50V3JpdGVyelxcbm9kZV9tb2R1bGVzXFwucG5wbVxcQG1vdGlvbm9uZSt0eXBlc0AxMC4xNy4xXFxub2RlX21vZHVsZXNcXEBtb3Rpb25vbmVcXHR5cGVzXFxkaXN0XFxNb3Rpb25WYWx1ZS5lcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBNb3Rpb25WYWx1ZSB0cmFja3MgdGhlIHN0YXRlIG9mIGEgc2luZ2xlIGFuaW1hdGFibGVcbiAqIHZhbHVlLiBDdXJyZW50bHksIHVwZGF0ZWRBdCBhbmQgY3VycmVudCBhcmUgdW51c2VkLiBUaGVcbiAqIGxvbmcgdGVybSBpZGVhIGlzIHRvIHVzZSB0aGlzIHRvIG1pbmltaXNlIHRoZSBudW1iZXJcbiAqIG9mIERPTSByZWFkcywgYW5kIHRvIGFic3RyYWN0IHRoZSBET00gaW50ZXJhY3Rpb25zIGhlcmUuXG4gKi9cbmNsYXNzIE1vdGlvblZhbHVlIHtcbiAgICBzZXRBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuICAgICAgICBhbmltYXRpb24gPT09IG51bGwgfHwgYW5pbWF0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhbmltYXRpb24uZmluaXNoZWQudGhlbigoKSA9PiB0aGlzLmNsZWFyQW5pbWF0aW9uKCkpLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgfVxuICAgIGNsZWFyQW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHRoaXMuZ2VuZXJhdG9yID0gdW5kZWZpbmVkO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTW90aW9uVmFsdWUgfTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@motionone+types@10.17.1/node_modules/@motionone/types/dist/MotionValue.es.js\n");

/***/ })

};
;