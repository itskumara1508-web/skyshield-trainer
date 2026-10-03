/**
 * SkyShield Trainer - Pre-filled Trainee Session History
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * 10 Detailed session records with 3D flight path coordinates, decision events,
 * and scoring metrics for immediate population of AAR Dashboard and Replay Viewers.
 */

export const SAMPLE_SESSIONS = [
  {
    id: 'ses-20261003-01',
    traineeId: 'tr-002',
    traineeName: 'Sqn Ldr Ananya Sharma',
    serviceNo: 'IAF-29831',
    scenarioId: 'scn-iron-shield-delta',
    scenarioName: 'Iron Shield Delta',
    date: '2026-10-03 08:15',
    duration: 88,
    score: 97,
    grade: 'S',
    ratingLabel: 'EXEMPLARY TACTICAL READINESS',
    avgLatency: 2.8,
    classificationAccuracy: 100,
    roeViolations: 0,
    contactsCount: 6,
    interceptsCount: 5,
    events: [
      { time: 3.2, type: 'detect', trackId: 'trk-is-01', label: 'TALON-LEAD flagged by EW radar' },
      { time: 5.8, type: 'classify', trackId: 'trk-is-01', label: 'TALON-LEAD confirmed HOSTILE munition' },
      { time: 7.1, type: 'detect', trackId: 'trk-is-05', label: 'CIV-MED-CARRIER detected entering airspace' },
      { time: 9.4, type: 'classify', trackId: 'trk-is-05', label: 'CIV-MED-CARRIER verified BENIGN civilian' },
      { time: 11.2, type: 'response', trackId: 'trk-is-05', label: 'Civilian drone issued redirect warning' },
      { time: 14.5, type: 'response', trackId: 'trk-is-01', label: 'TALON-LEAD neutralized via RF Jammer' },
      { time: 22.0, type: 'response', trackId: 'trk-is-02', label: 'TALON-TWO hard-kill intercept authorized' },
    ],
    flightPaths: {
      'trk-is-01': [
        [-190, 52, 110], [-150, 48, 80], [-110, 42, 50], [-70, 35, 25], [-35, 28, 10]
      ],
      'trk-is-02': [
        [-210, 48, 130], [-170, 44, 100], [-130, 40, 70], [-90, 36, 40], [-45, 30, 15]
      ],
      'trk-is-03': [
        [-170, 75, 160], [-130, 70, 120], [-100, 65, 80], [-60, 60, 50], [-20, 55, 30]
      ],
      'trk-is-05': [
        [180, 85, 140], [150, 80, 110], [120, 78, 80], [95, 75, 55], [70, 70, 30]
      ]
    },
    identifiedMistakes: [],
  },
  {
    id: 'ses-20261002-02',
    traineeId: 'tr-001',
    traineeName: 'Maj. Vikramaditya Rathore',
    serviceNo: 'IC-78921A',
    scenarioId: 'scn-border-sentinel-echo',
    scenarioName: 'Border Sentinel Echo',
    date: '2026-10-02 18:30',
    duration: 90,
    score: 94,
    grade: 'S',
    ratingLabel: 'EXEMPLARY TACTICAL READINESS',
    avgLatency: 3.4,
    classificationAccuracy: 95,
    roeViolations: 0,
    contactsCount: 7,
    interceptsCount: 6,
    events: [
      { time: 4.1, type: 'detect', trackId: 'trk-be-01', label: 'Radar strobe burn-through on VIPER-LEAD' },
      { time: 7.2, type: 'classify', trackId: 'trk-be-01', label: 'VIPER-LEAD classified HOSTILE' },
      { time: 10.5, type: 'response', trackId: 'trk-be-04', label: 'Counter-EW beam steered to GHOST-JAMMER' },
      { time: 16.8, type: 'response', trackId: 'trk-be-01', label: 'High-power microwave pulse neutralized VIPER-LEAD' },
    ],
    flightPaths: {
      'trk-be-01': [
        [220, 38, -130], [170, 36, -100], [120, 32, -70], [70, 28, -40], [30, 24, -15]
      ],
      'trk-be-02': [
        [240, 42, -110], [190, 39, -80], [140, 35, -50], [90, 30, -20], [40, 26, 0]
      ],
      'trk-be-07': [
        [0, 95, 230], [0, 90, 180], [0, 85, 130], [0, 80, 80], [0, 75, 30]
      ]
    },
    identifiedMistakes: [],
  },
  {
    id: 'ses-20261002-03',
    traineeId: 'tr-003',
    traineeName: 'Capt. Rohan Deshmukh',
    serviceNo: 'IC-82104M',
    scenarioId: 'scn-iron-shield-delta',
    scenarioName: 'Iron Shield Delta',
    date: '2026-10-02 14:20',
    duration: 90,
    score: 84,
    grade: 'A',
    ratingLabel: 'COMBAT READY',
    avgLatency: 5.1,
    classificationAccuracy: 88,
    roeViolations: 1,
    contactsCount: 6,
    interceptsCount: 4,
    events: [
      { time: 6.2, type: 'detect', trackId: 'trk-is-01', label: 'Acoustic detector flagged drone pitch' },
      { time: 11.4, type: 'classify', trackId: 'trk-is-05', label: 'Civilian quad mistakenly flagged UNKNOWN' },
      { time: 18.0, type: 'response', trackId: 'trk-is-05', label: 'Kinetic warning shot near civilian track' },
    ],
    flightPaths: {
      'trk-is-01': [
        [-190, 52, 110], [-140, 46, 80], [-90, 40, 50], [-40, 32, 20]
      ],
      'trk-is-05': [
        [180, 85, 140], [140, 80, 100], [100, 75, 60], [60, 70, 20]
      ]
    },
    identifiedMistakes: [
      {
        id: 'PREMATURE_ESCALATION',
        severity: 'medium',
        title: 'Premature Escalation Against Civilian Track',
        description: 'Issued kinetic warning vector against CIV-MED-CARRIER before awaiting transponder response.',
        recommendation: 'Ensure frequency spectrum interrogator query cycle completes prior to weapon charging.'
      }
    ],
  },
  {
    id: 'ses-20261002-04',
    traineeId: 'tr-004',
    traineeName: 'Lt Cdr Arvind Menon',
    serviceNo: 'IN-04982Z',
    scenarioId: 'scn-op-silent-horizon',
    scenarioName: 'Operation Silent Horizon',
    date: '2026-10-02 11:45',
    duration: 85,
    score: 89,
    grade: 'A',
    ratingLabel: 'COMBAT READY',
    avgLatency: 4.6,
    classificationAccuracy: 91,
    roeViolations: 0,
    contactsCount: 2,
    interceptsCount: 1,
    events: [
      { time: 4.8, type: 'detect', trackId: 'trk-sh-01', label: 'Low-RCS blip detected on 3D radar' },
      { time: 8.5, type: 'classify', trackId: 'trk-sh-01', label: 'SPECTER-01 confirmed hostile stealth scout' },
      { time: 14.2, type: 'response', trackId: 'trk-sh-01', label: 'Directional GNSS spoofing deployed' },
    ],
    flightPaths: {
      'trk-sh-01': [
        [-160, 42, -180], [-110, 40, -120], [-60, 38, -60], [-10, 35, 0]
      ],
      'trk-sh-02': [
        [210, 65, 120], [160, 60, 80], [110, 55, 40], [60, 50, 0]
      ]
    },
    identifiedMistakes: [],
  },
  {
    id: 'ses-20261001-05',
    traineeId: 'tr-005',
    traineeName: 'Maj. Gurpreet Singh',
    serviceNo: 'IC-84912K',
    scenarioId: 'scn-border-sentinel-echo',
    scenarioName: 'Border Sentinel Echo',
    date: '2026-10-01 19:10',
    duration: 90,
    score: 91,
    grade: 'A',
    ratingLabel: 'COMBAT READY',
    avgLatency: 3.9,
    classificationAccuracy: 94,
    roeViolations: 0,
    contactsCount: 7,
    interceptsCount: 5,
    events: [
      { time: 4.2, type: 'detect', trackId: 'trk-be-01', label: 'Perimeter radar picked up lead swarm element' },
      { time: 9.0, type: 'response', trackId: 'trk-be-01', label: 'Laser directed energy strike executed' },
    ],
    flightPaths: {
      'trk-be-01': [
        [220, 38, -130], [160, 35, -90], [100, 30, -50], [40, 25, -10]
      ]
    },
    identifiedMistakes: [],
  },
  {
    id: 'ses-20261001-06',
    traineeId: 'tr-006',
    traineeName: 'Flt Lt Kavya Nair',
    serviceNo: 'IAF-31045',
    scenarioId: 'scn-iron-shield-delta',
    scenarioName: 'Iron Shield Delta',
    date: '2026-10-01 16:50',
    duration: 90,
    score: 78,
    grade: 'B',
    ratingLabel: 'QUALIFIED WITH MARGIN',
    avgLatency: 6.8,
    classificationAccuracy: 82,
    roeViolations: 1,
    contactsCount: 6,
    interceptsCount: 3,
    events: [
      { time: 7.8, type: 'detect', trackId: 'trk-is-01', label: 'Target flagged after 7.8s delay' },
      { time: 15.2, type: 'classify', trackId: 'trk-is-02', label: 'Talon-Two misclassified as Decoy' },
    ],
    flightPaths: {
      'trk-is-01': [
        [-190, 52, 110], [-130, 45, 70], [-70, 38, 30]
      ]
    },
    identifiedMistakes: [
      {
        id: 'DELAYED_RESPONSE',
        severity: 'high',
        title: 'Tactical Hesitation in Terminal Zone',
        description: 'Trainee allowed lead attack drone to reach 110m perimeter before taking intercept action.',
        recommendation: 'Initiate soft-kill jamming at 250m outer ring immediately.'
      }
    ],
  },
  {
    id: 'ses-20260930-07',
    traineeId: 'tr-007',
    traineeName: 'Capt. Siddharth Rao',
    serviceNo: 'IC-87432W',
    scenarioId: 'scn-op-silent-horizon',
    scenarioName: 'Operation Silent Horizon',
    date: '2026-09-30 09:30',
    duration: 75,
    score: 86,
    grade: 'A',
    ratingLabel: 'COMBAT READY',
    avgLatency: 4.8,
    classificationAccuracy: 89,
    roeViolations: 0,
    contactsCount: 2,
    interceptsCount: 1,
    events: [
      { time: 5.0, type: 'detect', trackId: 'trk-sh-01', label: 'Thermal IR trigger acknowledged' },
      { time: 10.1, type: 'response', trackId: 'trk-sh-01', label: 'Sky-net physical capture drone launched' },
    ],
    flightPaths: {
      'trk-sh-01': [
        [-160, 42, -180], [-100, 39, -100], [-40, 35, -20]
      ]
    },
    identifiedMistakes: [],
  },
  {
    id: 'ses-20260929-08',
    traineeId: 'tr-008',
    traineeName: 'Lt. Aditya Verma',
    serviceNo: 'IC-89914P',
    scenarioId: 'scn-iron-shield-delta',
    scenarioName: 'Iron Shield Delta',
    date: '2026-09-29 13:00',
    duration: 90,
    score: 68,
    grade: 'C',
    ratingLabel: 'REMEDIAL DRILLS REQUIRED',
    avgLatency: 8.4,
    classificationAccuracy: 74,
    roeViolations: 2,
    contactsCount: 6,
    interceptsCount: 2,
    events: [
      { time: 9.8, type: 'detect', trackId: 'trk-is-01', label: 'Critical latency warning on track' },
      { time: 24.0, type: 'response', trackId: 'trk-is-05', label: 'ROE VIOLATION: Neutralized benign civilian track' },
    ],
    flightPaths: {
      'trk-is-05': [
        [180, 85, 140], [130, 78, 90], [80, 72, 40]
      ]
    },
    identifiedMistakes: [
      {
        id: 'CIVILIAN_ENGAGEMENT',
        severity: 'critical',
        title: 'Lethal Engagement of Neutral Asset',
        description: 'Authorized kinetic neutralization of CIV-MED-CARRIER in designated civilian transit corridor.',
        recommendation: 'Mandatory remedial IFF training on commercial telemetry markers.'
      }
    ],
  },
  {
    id: 'ses-20260928-09',
    traineeId: 'tr-009',
    traineeName: 'Sqn Ldr Prateek Joshi',
    serviceNo: 'IAF-28490',
    scenarioId: 'scn-border-sentinel-echo',
    scenarioName: 'Border Sentinel Echo',
    date: '2026-09-28 07:40',
    duration: 86,
    score: 93,
    grade: 'S',
    ratingLabel: 'EXEMPLARY TACTICAL READINESS',
    avgLatency: 3.6,
    classificationAccuracy: 95,
    roeViolations: 0,
    contactsCount: 7,
    interceptsCount: 6,
    events: [
      { time: 3.8, type: 'detect', trackId: 'trk-be-01', label: 'Pincer threat identified on NW approach' },
      { time: 8.2, type: 'response', trackId: 'trk-be-01', label: 'Anti-swarm barrage fired' },
    ],
    flightPaths: {
      'trk-be-01': [
        [220, 38, -130], [150, 33, -80], [80, 27, -30]
      ]
    },
    identifiedMistakes: [],
  },
  {
    id: 'ses-20260927-10',
    traineeId: 'tr-010',
    traineeName: 'Capt. Meera Kulkarni',
    serviceNo: 'IC-85421X',
    scenarioId: 'scn-iron-shield-delta',
    scenarioName: 'Iron Shield Delta',
    date: '2026-09-27 21:15',
    duration: 89,
    score: 88,
    grade: 'A',
    ratingLabel: 'COMBAT READY',
    avgLatency: 4.2,
    classificationAccuracy: 92,
    roeViolations: 0,
    contactsCount: 6,
    interceptsCount: 4,
    events: [
      { time: 4.5, type: 'detect', trackId: 'trk-is-03', label: 'Decoy drone RF signature isolated' },
      { time: 9.1, type: 'classify', trackId: 'trk-is-03', label: 'Decoy drone ignored to prioritize warhead vectors' },
    ],
    flightPaths: {
      'trk-is-03': [
        [-170, 75, 160], [-110, 68, 100], [-50, 60, 40]
      ]
    },
    identifiedMistakes: [],
  },
];

