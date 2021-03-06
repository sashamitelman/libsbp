/**
 * Copyright (C) 2015 Swift Navigation Inc.
 * Contact: Joshua Gross <josh@swift-nav.com>
 * This source is subject to the license found in the file 'LICENSE' which must
 * be distributed together with this source. All other rights reserved.
 *
 * THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND,
 * EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
 */

/**********************
 * Automatically generated from piksi/yaml/swiftnav/sbp/observation.yaml with generate.py.
 * Don't edit this by hand!
 **********************
 * Package description:
 *
 * Satellite observation messages from the device.
***********************/

var SBP = require('./sbp');
var Parser = require('binary-parser').Parser;

/**
 * SBP class for message fragment ObsGPSTime
 *
 * A wire-appropriate GPS time, defined as the number of milliseconds since
 * beginning of the week on the Saturday/Sunday transition.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field tow number (unsigned 32-bit int, 4 bytes) Milliseconds since start of GPS week
 * @field wn number (unsigned 16-bit int, 2 bytes) GPS week number
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var ObsGPSTime = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "ObsGPSTime";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
ObsGPSTime.prototype = Object.create(SBP.prototype);
ObsGPSTime.prototype.constructor = ObsGPSTime;
ObsGPSTime.prototype.parser = new Parser()
  .endianess('little')
  .uint32('tow')
  .uint16('wn');
ObsGPSTime.prototype.fieldSpec = [];
ObsGPSTime.prototype.fieldSpec.push(['tow', 'writeUInt32LE', 4]);
ObsGPSTime.prototype.fieldSpec.push(['wn', 'writeUInt16LE', 2]);

/**
 * SBP class for message fragment CarrierPhase
 *
 * Carrier phase measurement in cycles represented as a 40-bit fixed point number
 * with Q32.8 layout, i.e. 32-bits of whole cycles and 8-bits of fractional cycles.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field i number (signed 32-bit int, 4 bytes) Carrier phase whole cycles
 * @field f number (unsigned 8-bit int, 1 byte) Carrier phase fractional part
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var CarrierPhase = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "CarrierPhase";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
CarrierPhase.prototype = Object.create(SBP.prototype);
CarrierPhase.prototype.constructor = CarrierPhase;
CarrierPhase.prototype.parser = new Parser()
  .endianess('little')
  .int32('i')
  .uint8('f');
CarrierPhase.prototype.fieldSpec = [];
CarrierPhase.prototype.fieldSpec.push(['i', 'writeInt32LE', 4]);
CarrierPhase.prototype.fieldSpec.push(['f', 'writeUInt8', 1]);

/**
 * SBP class for message fragment ObservationHeader
 *
 * Header of a GPS observation message.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field t ObsGPSTime GPS time of this observation
 * @field n_obs number (unsigned 8-bit int, 1 byte) Total number of observations. First nibble is the size of the sequence (n),
 *   second nibble is the zero-indexed counter (ith packet of n)
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var ObservationHeader = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "ObservationHeader";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
ObservationHeader.prototype = Object.create(SBP.prototype);
ObservationHeader.prototype.constructor = ObservationHeader;
ObservationHeader.prototype.parser = new Parser()
  .endianess('little')
  .nest('t', { type: ObsGPSTime.prototype.parser })
  .uint8('n_obs');
ObservationHeader.prototype.fieldSpec = [];
ObservationHeader.prototype.fieldSpec.push(['t', ObsGPSTime.prototype.fieldSpec]);
ObservationHeader.prototype.fieldSpec.push(['n_obs', 'writeUInt8', 1]);

/**
 * SBP class for message fragment PackedObsContent
 *
 * Pseudorange and carrier phase observation for a satellite being tracked.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field P number (unsigned 32-bit int, 4 bytes) Pseudorange observation
 * @field L CarrierPhase Carrier phase observation
 * @field cn0 number (unsigned 8-bit int, 1 byte) Carrier-to-Noise density
 * @field lock number (unsigned 16-bit int, 2 bytes) Lock indicator. This value changes whenever a satellite signal has lost and
 *   regained lock, indicating that the carrier phase ambiguity may have changed.
 * @field sid number (unsigned 32-bit int, 4 bytes) Signal identifier of the satellite signal - values 0x00 through 0x1F represent
 *   GPS PRNs 1 through 32 respectively (PRN-1 notation); other values reserved for
 *   future use.
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var PackedObsContent = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "PackedObsContent";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
PackedObsContent.prototype = Object.create(SBP.prototype);
PackedObsContent.prototype.constructor = PackedObsContent;
PackedObsContent.prototype.parser = new Parser()
  .endianess('little')
  .uint32('P')
  .nest('L', { type: CarrierPhase.prototype.parser })
  .uint8('cn0')
  .uint16('lock')
  .uint32('sid');
PackedObsContent.prototype.fieldSpec = [];
PackedObsContent.prototype.fieldSpec.push(['P', 'writeUInt32LE', 4]);
PackedObsContent.prototype.fieldSpec.push(['L', CarrierPhase.prototype.fieldSpec]);
PackedObsContent.prototype.fieldSpec.push(['cn0', 'writeUInt8', 1]);
PackedObsContent.prototype.fieldSpec.push(['lock', 'writeUInt16LE', 2]);
PackedObsContent.prototype.fieldSpec.push(['sid', 'writeUInt32LE', 4]);

/**
 * SBP class for message MSG_OBS (0x0043).
 *
 * The GPS observations message reports all the raw pseudorange and carrier phase
 * observations for the satellites being tracked by the device. Carrier phase
 * observation here is represented as a 40-bit fixed point number with Q32.8 layout
 * (i.e. 32-bits of whole cycles and 8-bits of fractional cycles).
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field header ObservationHeader Header of a GPS observation message
 * @field obs array Pseudorange and carrier phase observation for a satellite being tracked.
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var MsgObs = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "MSG_OBS";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
MsgObs.prototype = Object.create(SBP.prototype);
MsgObs.prototype.constructor = MsgObs;
MsgObs.prototype.parser = new Parser()
  .endianess('little')
  .nest('header', { type: ObservationHeader.prototype.parser })
  .array('obs', { type: PackedObsContent.prototype.parser, readUntil: 'eof' });
MsgObs.prototype.fieldSpec = [];
MsgObs.prototype.fieldSpec.push(['header', ObservationHeader.prototype.fieldSpec]);
MsgObs.prototype.fieldSpec.push(['obs', 'array', PackedObsContent.prototype.fieldSpec, function () { return this.fields.array.length; }]);

/**
 * SBP class for message MSG_BASE_POS (0x0044).
 *
 * The base station position message is the position reported by the base station
 * itself. It is used for pseudo-absolute RTK positioning, and is required to be a
 * high-accuracy surveyed location of the base station. Any error here will result
 * in an error in the pseudo-absolute position output.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field lat number (float, 8 bytes) Latitude
 * @field lon number (float, 8 bytes) Longitude
 * @field height number (float, 8 bytes) Height
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var MsgBasePos = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "MSG_BASE_POS";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
MsgBasePos.prototype = Object.create(SBP.prototype);
MsgBasePos.prototype.constructor = MsgBasePos;
MsgBasePos.prototype.parser = new Parser()
  .endianess('little')
  .doublele('lat')
  .doublele('lon')
  .doublele('height');
MsgBasePos.prototype.fieldSpec = [];
MsgBasePos.prototype.fieldSpec.push(['lat', 'writeDoubleLE', 8]);
MsgBasePos.prototype.fieldSpec.push(['lon', 'writeDoubleLE', 8]);
MsgBasePos.prototype.fieldSpec.push(['height', 'writeDoubleLE', 8]);

/**
 * SBP class for message MSG_EPHEMERIS (0x0047).
 *
 * The ephemeris message returns a set of satellite orbit parameters that is used
 * to calculate GPS satellite position, velocity, and clock offset. Please see the
 * Navstar GPS Space Segment/Navigation user interfaces (ICD-GPS-200, Table 20-III)
 * for more details.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field tgd number (float, 8 bytes) Group delay differential between L1 and L2
 * @field c_rs number (float, 8 bytes) Amplitude of the sine harmonic correction term to the orbit radius
 * @field c_rc number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the orbit radius
 * @field c_uc number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the argument of latitude
 * @field c_us number (float, 8 bytes) Amplitude of the sine harmonic correction term to the argument of latitude
 * @field c_ic number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the angle of inclination
 * @field c_is number (float, 8 bytes) Amplitude of the sine harmonic correction term to the angle of inclination
 * @field dn number (float, 8 bytes) Mean motion difference
 * @field m0 number (float, 8 bytes) Mean anomaly at reference time
 * @field ecc number (float, 8 bytes) Eccentricity of satellite orbit
 * @field sqrta number (float, 8 bytes) Square root of the semi-major axis of orbit
 * @field omega0 number (float, 8 bytes) Longitude of ascending node of orbit plane at weekly epoch
 * @field omegadot number (float, 8 bytes) Rate of right ascension
 * @field w number (float, 8 bytes) Argument of perigee
 * @field inc number (float, 8 bytes) Inclination
 * @field inc_dot number (float, 8 bytes) Inclination first derivative
 * @field af0 number (float, 8 bytes) Polynomial clock correction coefficient (clock bias)
 * @field af1 number (float, 8 bytes) Polynomial clock correction coefficient (clock drift)
 * @field af2 number (float, 8 bytes) Polynomial clock correction coefficient (rate of clock drift)
 * @field toe_tow number (float, 8 bytes) Time of week
 * @field toe_wn number (unsigned 16-bit int, 2 bytes) Week number
 * @field toc_tow number (float, 8 bytes) Clock reference time of week
 * @field toc_wn number (unsigned 16-bit int, 2 bytes) Clock reference week number
 * @field valid number (unsigned 8-bit int, 1 byte) Is valid?
 * @field healthy number (unsigned 8-bit int, 1 byte) Satellite is healthy?
 * @field sid number (unsigned 32-bit int, 4 bytes) Signal identifier being tracked - values 0x00 through 0x1F represent GPS PRNs 1
 *   through 32 respectively (PRN-1 notation); other values reserved for future use
 * @field iode number (unsigned 8-bit int, 1 byte) Issue of ephemeris data
 * @field iodc number (unsigned 16-bit int, 2 bytes) Issue of clock data
 * @field reserved number (unsigned 32-bit int, 4 bytes) Reserved field
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var MsgEphemeris = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "MSG_EPHEMERIS";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
MsgEphemeris.prototype = Object.create(SBP.prototype);
MsgEphemeris.prototype.constructor = MsgEphemeris;
MsgEphemeris.prototype.parser = new Parser()
  .endianess('little')
  .doublele('tgd')
  .doublele('c_rs')
  .doublele('c_rc')
  .doublele('c_uc')
  .doublele('c_us')
  .doublele('c_ic')
  .doublele('c_is')
  .doublele('dn')
  .doublele('m0')
  .doublele('ecc')
  .doublele('sqrta')
  .doublele('omega0')
  .doublele('omegadot')
  .doublele('w')
  .doublele('inc')
  .doublele('inc_dot')
  .doublele('af0')
  .doublele('af1')
  .doublele('af2')
  .doublele('toe_tow')
  .uint16('toe_wn')
  .doublele('toc_tow')
  .uint16('toc_wn')
  .uint8('valid')
  .uint8('healthy')
  .uint32('sid')
  .uint8('iode')
  .uint16('iodc')
  .uint32('reserved');
MsgEphemeris.prototype.fieldSpec = [];
MsgEphemeris.prototype.fieldSpec.push(['tgd', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['c_rs', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['c_rc', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['c_uc', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['c_us', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['c_ic', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['c_is', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['dn', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['m0', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['ecc', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['sqrta', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['omega0', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['omegadot', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['w', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['inc', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['inc_dot', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['af0', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['af1', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['af2', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['toe_tow', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['toe_wn', 'writeUInt16LE', 2]);
MsgEphemeris.prototype.fieldSpec.push(['toc_tow', 'writeDoubleLE', 8]);
MsgEphemeris.prototype.fieldSpec.push(['toc_wn', 'writeUInt16LE', 2]);
MsgEphemeris.prototype.fieldSpec.push(['valid', 'writeUInt8', 1]);
MsgEphemeris.prototype.fieldSpec.push(['healthy', 'writeUInt8', 1]);
MsgEphemeris.prototype.fieldSpec.push(['sid', 'writeUInt32LE', 4]);
MsgEphemeris.prototype.fieldSpec.push(['iode', 'writeUInt8', 1]);
MsgEphemeris.prototype.fieldSpec.push(['iodc', 'writeUInt16LE', 2]);
MsgEphemeris.prototype.fieldSpec.push(['reserved', 'writeUInt32LE', 4]);

/**
 * SBP class for message MSG_EPHEMERIS_DEP_A (0x001A).
 *
 * Deprecated.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field tgd number (float, 8 bytes) Group delay differential between L1 and L2
 * @field c_rs number (float, 8 bytes) Amplitude of the sine harmonic correction term to the orbit radius
 * @field c_rc number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the orbit radius
 * @field c_uc number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the argument of latitude
 * @field c_us number (float, 8 bytes) Amplitude of the sine harmonic correction term to the argument of latitude
 * @field c_ic number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the angle of inclination
 * @field c_is number (float, 8 bytes) Amplitude of the sine harmonic correction term to the angle of inclination
 * @field dn number (float, 8 bytes) Mean motion difference
 * @field m0 number (float, 8 bytes) Mean anomaly at reference time
 * @field ecc number (float, 8 bytes) Eccentricity of satellite orbit
 * @field sqrta number (float, 8 bytes) Square root of the semi-major axis of orbit
 * @field omega0 number (float, 8 bytes) Longitude of ascending node of orbit plane at weekly epoch
 * @field omegadot number (float, 8 bytes) Rate of right ascension
 * @field w number (float, 8 bytes) Argument of perigee
 * @field inc number (float, 8 bytes) Inclination
 * @field inc_dot number (float, 8 bytes) Inclination first derivative
 * @field af0 number (float, 8 bytes) Polynomial clock correction coefficient (clock bias)
 * @field af1 number (float, 8 bytes) Polynomial clock correction coefficient (clock drift)
 * @field af2 number (float, 8 bytes) Polynomial clock correction coefficient (rate of clock drift)
 * @field toe_tow number (float, 8 bytes) Time of week
 * @field toe_wn number (unsigned 16-bit int, 2 bytes) Week number
 * @field toc_tow number (float, 8 bytes) Clock reference time of week
 * @field toc_wn number (unsigned 16-bit int, 2 bytes) Clock reference week number
 * @field valid number (unsigned 8-bit int, 1 byte) Is valid?
 * @field healthy number (unsigned 8-bit int, 1 byte) Satellite is healthy?
 * @field prn number (unsigned 8-bit int, 1 byte) PRN being tracked
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var MsgEphemerisDepA = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "MSG_EPHEMERIS_DEP_A";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
MsgEphemerisDepA.prototype = Object.create(SBP.prototype);
MsgEphemerisDepA.prototype.constructor = MsgEphemerisDepA;
MsgEphemerisDepA.prototype.parser = new Parser()
  .endianess('little')
  .doublele('tgd')
  .doublele('c_rs')
  .doublele('c_rc')
  .doublele('c_uc')
  .doublele('c_us')
  .doublele('c_ic')
  .doublele('c_is')
  .doublele('dn')
  .doublele('m0')
  .doublele('ecc')
  .doublele('sqrta')
  .doublele('omega0')
  .doublele('omegadot')
  .doublele('w')
  .doublele('inc')
  .doublele('inc_dot')
  .doublele('af0')
  .doublele('af1')
  .doublele('af2')
  .doublele('toe_tow')
  .uint16('toe_wn')
  .doublele('toc_tow')
  .uint16('toc_wn')
  .uint8('valid')
  .uint8('healthy')
  .uint8('prn');
MsgEphemerisDepA.prototype.fieldSpec = [];
MsgEphemerisDepA.prototype.fieldSpec.push(['tgd', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['c_rs', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['c_rc', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['c_uc', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['c_us', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['c_ic', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['c_is', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['dn', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['m0', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['ecc', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['sqrta', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['omega0', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['omegadot', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['w', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['inc', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['inc_dot', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['af0', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['af1', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['af2', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['toe_tow', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['toe_wn', 'writeUInt16LE', 2]);
MsgEphemerisDepA.prototype.fieldSpec.push(['toc_tow', 'writeDoubleLE', 8]);
MsgEphemerisDepA.prototype.fieldSpec.push(['toc_wn', 'writeUInt16LE', 2]);
MsgEphemerisDepA.prototype.fieldSpec.push(['valid', 'writeUInt8', 1]);
MsgEphemerisDepA.prototype.fieldSpec.push(['healthy', 'writeUInt8', 1]);
MsgEphemerisDepA.prototype.fieldSpec.push(['prn', 'writeUInt8', 1]);

/**
 * SBP class for message MSG_EPHEMERIS_DEP_B (0x0046).
 *
 * Deprecated.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field tgd number (float, 8 bytes) Group delay differential between L1 and L2
 * @field c_rs number (float, 8 bytes) Amplitude of the sine harmonic correction term to the orbit radius
 * @field c_rc number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the orbit radius
 * @field c_uc number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the argument of latitude
 * @field c_us number (float, 8 bytes) Amplitude of the sine harmonic correction term to the argument of latitude
 * @field c_ic number (float, 8 bytes) Amplitude of the cosine harmonic correction term to the angle of inclination
 * @field c_is number (float, 8 bytes) Amplitude of the sine harmonic correction term to the angle of inclination
 * @field dn number (float, 8 bytes) Mean motion difference
 * @field m0 number (float, 8 bytes) Mean anomaly at reference time
 * @field ecc number (float, 8 bytes) Eccentricity of satellite orbit
 * @field sqrta number (float, 8 bytes) Square root of the semi-major axis of orbit
 * @field omega0 number (float, 8 bytes) Longitude of ascending node of orbit plane at weekly epoch
 * @field omegadot number (float, 8 bytes) Rate of right ascension
 * @field w number (float, 8 bytes) Argument of perigee
 * @field inc number (float, 8 bytes) Inclination
 * @field inc_dot number (float, 8 bytes) Inclination first derivative
 * @field af0 number (float, 8 bytes) Polynomial clock correction coefficient (clock bias)
 * @field af1 number (float, 8 bytes) Polynomial clock correction coefficient (clock drift)
 * @field af2 number (float, 8 bytes) Polynomial clock correction coefficient (rate of clock drift)
 * @field toe_tow number (float, 8 bytes) Time of week
 * @field toe_wn number (unsigned 16-bit int, 2 bytes) Week number
 * @field toc_tow number (float, 8 bytes) Clock reference time of week
 * @field toc_wn number (unsigned 16-bit int, 2 bytes) Clock reference week number
 * @field valid number (unsigned 8-bit int, 1 byte) Is valid?
 * @field healthy number (unsigned 8-bit int, 1 byte) Satellite is healthy?
 * @field prn number (unsigned 8-bit int, 1 byte) PRN being tracked
 * @field iode number (unsigned 8-bit int, 1 byte) Issue of ephemeris data
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var MsgEphemerisDepB = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "MSG_EPHEMERIS_DEP_B";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
MsgEphemerisDepB.prototype = Object.create(SBP.prototype);
MsgEphemerisDepB.prototype.constructor = MsgEphemerisDepB;
MsgEphemerisDepB.prototype.parser = new Parser()
  .endianess('little')
  .doublele('tgd')
  .doublele('c_rs')
  .doublele('c_rc')
  .doublele('c_uc')
  .doublele('c_us')
  .doublele('c_ic')
  .doublele('c_is')
  .doublele('dn')
  .doublele('m0')
  .doublele('ecc')
  .doublele('sqrta')
  .doublele('omega0')
  .doublele('omegadot')
  .doublele('w')
  .doublele('inc')
  .doublele('inc_dot')
  .doublele('af0')
  .doublele('af1')
  .doublele('af2')
  .doublele('toe_tow')
  .uint16('toe_wn')
  .doublele('toc_tow')
  .uint16('toc_wn')
  .uint8('valid')
  .uint8('healthy')
  .uint8('prn')
  .uint8('iode');
MsgEphemerisDepB.prototype.fieldSpec = [];
MsgEphemerisDepB.prototype.fieldSpec.push(['tgd', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['c_rs', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['c_rc', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['c_uc', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['c_us', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['c_ic', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['c_is', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['dn', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['m0', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['ecc', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['sqrta', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['omega0', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['omegadot', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['w', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['inc', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['inc_dot', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['af0', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['af1', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['af2', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['toe_tow', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['toe_wn', 'writeUInt16LE', 2]);
MsgEphemerisDepB.prototype.fieldSpec.push(['toc_tow', 'writeDoubleLE', 8]);
MsgEphemerisDepB.prototype.fieldSpec.push(['toc_wn', 'writeUInt16LE', 2]);
MsgEphemerisDepB.prototype.fieldSpec.push(['valid', 'writeUInt8', 1]);
MsgEphemerisDepB.prototype.fieldSpec.push(['healthy', 'writeUInt8', 1]);
MsgEphemerisDepB.prototype.fieldSpec.push(['prn', 'writeUInt8', 1]);
MsgEphemerisDepB.prototype.fieldSpec.push(['iode', 'writeUInt8', 1]);

/**
 * SBP class for message fragment PackedObsContentDepA
 *
 * Deprecated.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field P number (unsigned 32-bit int, 4 bytes) Pseudorange observation
 * @field L CarrierPhase Carrier phase observation
 * @field cn0 number (unsigned 8-bit int, 1 byte) Carrier-to-Noise density
 * @field lock number (unsigned 16-bit int, 2 bytes) Lock indicator. This value changes whenever a satellite signal has lost and
 *   regained lock, indicating that the carrier phase ambiguity may have changed.
 * @field prn number (unsigned 8-bit int, 1 byte) PRN-1 identifier of the satellite signal
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var PackedObsContentDepA = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "PackedObsContentDepA";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
PackedObsContentDepA.prototype = Object.create(SBP.prototype);
PackedObsContentDepA.prototype.constructor = PackedObsContentDepA;
PackedObsContentDepA.prototype.parser = new Parser()
  .endianess('little')
  .uint32('P')
  .nest('L', { type: CarrierPhase.prototype.parser })
  .uint8('cn0')
  .uint16('lock')
  .uint8('prn');
PackedObsContentDepA.prototype.fieldSpec = [];
PackedObsContentDepA.prototype.fieldSpec.push(['P', 'writeUInt32LE', 4]);
PackedObsContentDepA.prototype.fieldSpec.push(['L', CarrierPhase.prototype.fieldSpec]);
PackedObsContentDepA.prototype.fieldSpec.push(['cn0', 'writeUInt8', 1]);
PackedObsContentDepA.prototype.fieldSpec.push(['lock', 'writeUInt16LE', 2]);
PackedObsContentDepA.prototype.fieldSpec.push(['prn', 'writeUInt8', 1]);

/**
 * SBP class for message MSG_OBS_DEP_A (0x0045).
 *
 * Deprecated.
 *
 * Fields in the SBP payload (`sbp.payload`):
 * @field header ObservationHeader Header of a GPS observation message
 * @field obs array Pseudorange and carrier phase observation for a satellite being tracked.
 *
 * @param sbp An SBP object with a payload to be decoded.
 */
var MsgObsDepA = function (sbp) {
  SBP.call(this, sbp);
  this.messageType = "MSG_OBS_DEP_A";
  this.fields = this.parser.parse(sbp.payload);

  return this;
};
MsgObsDepA.prototype = Object.create(SBP.prototype);
MsgObsDepA.prototype.constructor = MsgObsDepA;
MsgObsDepA.prototype.parser = new Parser()
  .endianess('little')
  .nest('header', { type: ObservationHeader.prototype.parser })
  .array('obs', { type: PackedObsContentDepA.prototype.parser, readUntil: 'eof' });
MsgObsDepA.prototype.fieldSpec = [];
MsgObsDepA.prototype.fieldSpec.push(['header', ObservationHeader.prototype.fieldSpec]);
MsgObsDepA.prototype.fieldSpec.push(['obs', 'array', PackedObsContentDepA.prototype.fieldSpec, function () { return this.fields.array.length; }]);

module.exports = {
  0x0043: MsgObs,
  0x0044: MsgBasePos,
  0x0047: MsgEphemeris,
  0x001A: MsgEphemerisDepA,
  0x0046: MsgEphemerisDepB,
  0x0045: MsgObsDepA,
}