/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone library name space and user-facing APIs.
 */


'use strict';

const BufferList = require('./buffer-list.js');
const FOAConvolver = require('./foa-convolver.js');
const FOADecoder = require('./foa-decoder.js');
const FOAPhaseMatchedFilter = require('./foa-phase-matched-filter.js');
const FOARenderer = require('./foa-renderer.js');
const FOARotator = require('./foa-rotator.js');
const FOARouter = require('./foa-router.js');
const FOAVirtualSpeaker = require('./foa-virtual-speaker.js');
const HOAConvolver = require('./hoa-convolver.js');
const HOARenderer = require('./hoa-renderer.js');
const HOARotator = require('./hoa-rotator.js');
const Polyfill = require('./polyfill.js');
const Utils = require('./utils.js');
const Version = require('./version.js');

// DEPRECATED in V1, in favor of BufferList.
const AudioBufferManager = require('./audiobuffer-manager.js');


/**
 * Omnitone namespace.
 * @namespace
 */
let Omnitone = {};


/**
 * @typedef {Object} BrowserInfo
 * @property {string} name - Browser name.
 * @property {string} version - Browser version.
 */

/**
 * An object contains the detected browser name and version.
 * @memberOf Omnitone
 * @static {BrowserInfo}
 */
Omnitone.browserInfo = Polyfill.getBrowserInfo();


// DEPRECATED in V1. DO. NOT. USE.
Omnitone.loadAudioBuffers = function(context, speakerData) {
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(context, speakerData, function(buffers) {
      resolve(buffers);
    }, reject);
  });
};


/**
 * Performs the async loading/decoding of multiple AudioBuffers from multiple
 * URLs.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @return {Promise<AudioBuffer[]>} - The promise resolves with an array of
 * AudioBuffer.
 */
Omnitone.createBufferList = function(context, bufferData) {
  const bufferList = new BufferList(context, bufferData);
  return bufferList.load();
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
Omnitone.mergeBufferListByChannel = Utils.mergeBufferListByChannel;


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
Omnitone.splitBufferbyChannel = Utils.splitBufferbyChannel;


/**
 * Creates an instance of FOA Convolver.
 * @see FOAConvolver
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * @return {FOAConvolver}
 */
Omnitone.createFOAConvolver = function(context, hrirBufferList) {
  return new FOAConvolver(context, hrirBufferList);
};


/**
 * Create an instance of FOA Router.
 * @see FOARouter
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 * @return {FOARouter}
 */
Omnitone.createFOARouter = function(context, channelMap) {
  return new FOARouter(context, channelMap);
};


/**
 * Create an instance of FOA Rotator.
 * @see FOARotator
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOARotator}
 */
Omnitone.createFOARotator = function(context) {
  return new FOARotator(context);
};


/**
 * Create an instance of FOAPhaseMatchedFilter.
 * @ignore
 * @see FOAPhaseMatchedFilter
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOAPhaseMatchedFilter}
 */
Omnitone.createFOAPhaseMatchedFilter = function(context) {
  return new FOAPhaseMatchedFilter(context);
};


/**
 * Create an instance of FOAVirtualSpeaker. For parameters, refer the
 * definition of VirtualSpeaker class.
 * @ignore
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options.
 * @return {FOAVirtualSpeaker}
 */
Omnitone.createFOAVirtualSpeaker = function(context, options) {
  return new FOAVirtualSpeaker(context, options);
};


/**
 * DEPRECATED. Use FOARenderer instance.
 * @see FOARenderer
 * @param {AudioContext} context - Associated AudioContext.
 * @param {DOMElement} videoElement - Video or Audio DOM element to be streamed.
 * @param {Object} options - Options for FOA decoder.
 * @param {String} options.baseResourceUrl - Base URL for resources.
 * (base path for HRIR files)
 * @param {Number} [options.postGain=26.0] - Post-decoding gain compensation.
 * @param {Array} [options.routingDestination]  Custom channel layout.
 * @return {FOADecoder}
 */
Omnitone.createFOADecoder = function(context, videoElement, options) {
  Utils.log('WARNING: FOADecoder is deprecated in favor of FOARenderer.');
  return new FOADecoder(context, videoElement, options);
};


/**
 * Create a FOARenderer, the first-order ambisonic decoder and the optimized
 * binaural renderer.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {FOARenderer}
 */
Omnitone.createFOARenderer = function(context, config) {
  return new FOARenderer(context, config);
};


/**
 * Creates HOARotator for higher-order ambisonics rotation.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 * @return {HOARotator}
 */
Omnitone.createHOARotator = function(context, ambisonicOrder) {
  return new HOARotator(context, ambisonicOrder);
};


/**
 * Creates HOAConvolver performs the multi-channel convolution for the optmized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 * @return {HOAConvovler}
 */
Omnitone.createHOAConvolver = function(
    context, ambisonicOrder, hrirBufferList) {
  return new HOAConvolver(context, ambisonicOrder, hrirBufferList);
};


/**
 * Creates HOARenderer for higher-order ambisonic decoding and the optimized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {HOARenderer}
 */
Omnitone.createHOARenderer = function(context, config) {
  return new HOARenderer(context, config);
};


// Handler Preload Tasks.
// - Detects the browser information.
// - Prints out the version number.
(function() {
  Utils.log('Version ' + Version + ' (running ' +
      Omnitone.browserInfo.name + ' ' + Omnitone.browserInfo.version +
      ' on ' + Omnitone.browserInfo.platform +')');
  if (Omnitone.browserInfo.name.toLowerCase() === 'safari') {
    Polyfill.patchSafari();
    Utils.log(Omnitone.browserInfo.name + ' detected. Appliying polyfill...');
  }
})();


module.exports = Omnitone;
