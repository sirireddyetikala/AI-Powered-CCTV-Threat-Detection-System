# System Architecture & Data Flow

## 🎯 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Upload)                           │
│                                                                     │
│  User selects dance video → Uploads to /getanalysis endpoint       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Step 1: Receive                        │
│                                                                     │
│  ✓ Multer receives video file                                      │
│  ✓ Saves to uploads/ directory                                     │
│  ✓ Creates database record (status: 'pending')                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  BACKEND - Step 2: ML Analysis                      │
│                (mlService.ts - Gemini AI)                           │
│                                                                     │
│  1. Read video file → Convert to Base64                            │
│  2. Send to Gemini 2.0 Flash with:                                 │
│     • System instruction (dance expert prompt)                     │
│     • Response schema (structured JSON)                            │
│     • Video data + custom prompt                                   │
│  3. Gemini AI analyzes:                                             │
│     ├─ Dance style identification                                  │
│     ├─ Mudra detection with timing                                 │
│     ├─ Expression analysis (Rasa/Bhava)                            │
│     └─ Storyline generation                                        │
│  4. Validate segment timing (no gaps)                              │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND - Step 3: Video Annotation                     │
│             (videoAnnotationService.ts - FFmpeg)                    │
│                                                                     │
│  IF FFmpeg is installed:                                            │
│    1. Generate drawtext filters for each segment                   │
│    2. Create FFmpeg command with overlays:                         │
│       ┌─────────────────────────────────────┐                      │
│       │ Mudra: Alapadma                     │                      │
│       │ Meaning: Blooming Lotus             │                      │
│       │ Expression: Peace                   │                      │
│       └─────────────────────────────────────┘                      │
│    3. Execute FFmpeg → Create annotated.mp4                        │
│    4. Generate .srt subtitle file                                  │
│                                                                     │
│  IF FFmpeg not installed:                                          │
│    • Skip video annotation                                         │
│    • Continue with ML results                                      │
│    • Set annotatedVideoPath = null                                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                BACKEND - Step 4: Save to Database                   │
│                                                                     │
│  UPDATE analyses SET:                                               │
│    • status = 'completed'                                           │
│    • ml_response = {                                                │
│        danceStyle: "Bharatanatyam",                                 │
│        segments: [...],                                             │
│        storyline: "..."                                             │
│      }                                                              │
│    • completed_at = NOW()                                           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                BACKEND - Step 5: Return Response                    │
│                                                                     │
│  {                                                                  │
│    success: true,                                                   │
│    data: {                                                          │
│      id: 1,                                                         │
│      ml_response: {                                                 │
│        danceStyle: "...",                                           │
│        segments: [...],                                             │
│        storyline: "..."                                             │
│      }                                                              │
│    },                                                               │
│    annotatedVideoPath: "/uploads/annotated/video_annotated.mp4",   │
│    subtitlePath: "/uploads/annotated/video.srt",                   │
│    storyline: "Complete narrative..."                              │
│  }                                                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND - Display Results                       │
│                                                                     │
│  Option 1: Show Storyline                                           │
│  ┌───────────────────────────────────────────────────┐             │
│  │ 📖 Performance Story                              │             │
│  │                                                   │             │
│  │ The dancer uses Alapadma to express purity,      │             │
│  │ conveying a sense of peace. The performance      │             │
│  │ then transitions to Katakamukha...               │             │
│  └───────────────────────────────────────────────────┘             │
│                                                                     │
│  Option 2: Play Annotated Video                                    │
│  ┌───────────────────────────────────────────────────┐             │
│  │ [▶ Video Player]                                  │             │
│  │                                                   │             │
│  │ ┌─────────────────────────────────────┐           │             │
│  │ │ Mudra: Alapadma                     │           │             │
│  │ │ Meaning: Blooming Lotus             │           │             │
│  │ │ Expression: Peace                   │           │             │
│  │ └─────────────────────────────────────┘           │             │
│  └───────────────────────────────────────────────────┘             │
│                                                                     │
│  Option 3: Timeline with Synchronized Captions                     │
│  ┌───────────────────────────────────────────────────┐             │
│  │ [Original Video]                                  │             │
│  │ ━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━                   │             │
│  │ 0.0s    2.5s   5.0s        10.0s                  │             │
│  │                                                   │             │
│  │ Current: Alapadma - Blooming Lotus (Peace)        │             │
│  └───────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Data Structure Flow

```typescript
// 1. INPUT: Video File
File {
  originalname: "dance.mp4",
  size: 5242880,
  mimetype: "video/mp4",
  path: "/uploads/abcd1234.mp4"
}

// 2. ML SERVICE OUTPUT: DanceAnalysisResult
{
  danceStyle: "Bharatanatyam",
  segments: [
    {
      startTime: 0.0,
      endTime: 2.5,
      mudraName: "Alapadma",
      meaning: "Blooming Lotus", 
      expression: "Peace",
      description: "Dancer performs opening stance..."
    },
    {
      startTime: 2.5,
      endTime: 5.0,
      mudraName: "Katakamukha",
      meaning: "Garland",
      expression: "Love",
      description: "Graceful transition..."
    }
  ],
  storyline: "The dancer uses Alapadma to express purity, conveying a sense of peace. The performance then transitions to Katakamukha, representing a garland and expressing love."
}

// 3. VIDEO ANNOTATION OUTPUT
{
  annotatedVideoPath: "/uploads/annotated/dance_annotated.mp4",
  subtitlePath: "/uploads/annotated/dance.srt"
}

// 4. FINAL API RESPONSE
{
  success: true,
  message: "Video analysis completed successfully",
  data: {
    id: 1,
    video_filename: "dance.mp4",
    status: "completed",
    ml_response: { ...DanceAnalysisResult },
    created_at: "2026-01-06T00:00:00Z",
    completed_at: "2026-01-06T00:02:30Z"
  },
  annotatedVideoPath: "...",
  subtitlePath: "...",
  storyline: "..."
}
```

## 🔄 Service Dependencies

```
analysisController.ts
    │
    ├─── mlService.ts
    │       └─── Gemini AI API
    │
    └─── videoAnnotationService.ts
            └─── FFmpeg CLI

types/index.ts (shared by all)
```

## 🎨 Text Overlay Layout

```
┌─────────────────────────────────────────┐
│                                         │
│         [Video Content]                 │
│                                         │
│                                         │
│         [Dancer Performing]             │
│                                         │
│                                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Mudra: Alapadma                     │ │ ← Line 1
│ │ Meaning: Blooming Lotus             │ │ ← Line 2
│ │ Expression: Peace                   │ │ ← Line 3
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Properties:
- Position: Bottom (default, configurable)
- Background: Semi-transparent black (black@0.7)
- Font: White, 24px
- Timing: Shows only during segment timestamps
```

## 📁 File Organization

```
nithya-analysis-backend/
│
├── uploads/
│   ├── video1_abcd1234.mp4          ← Original uploaded videos
│   ├── video2_efgh5678.mp4
│   │
│   └── annotated/
│       ├── video1_abcd1234_annotated.mp4  ← Annotated videos
│       ├── video1_abcd1234.srt            ← Subtitle files
│       ├── video2_efgh5678_annotated.mp4
│       └── video2_efgh5678.srt
│
├── src/
│   ├── services/
│   │   ├── mlService.ts              ← Gemini AI analysis
│   │   └── videoAnnotationService.ts ← FFmpeg overlays
│   │
│   ├── controllers/
│   │   └── analysisController.ts     ← Orchestration
│   │
│   └── types/
│       └── index.ts                  ← Shared types
│
└── [Documentation Files]
```

## ⚡ Performance Timeline

```
Time →  0s    10s    20s    30s    40s    50s    60s    70s    80s    90s    120s
        │     │      │      │      │      │      │      │      │      │      │
Upload  ●─────┤
              │
ML Analysis   ●──────────────────────●
                                     │
Video                                ●────────────────────────────────────────●
Annotation                                                                    │
                                                                              │
Save DB                                                                       ●──●
                                                                                 │
Response                                                                         ●

Total: ~90-120 seconds for a 30-second video
```

## 🎯 Key Insights

### Why Two Outputs?

1. **Annotated Video** → For visual playback with overlays
2. **Storyline Text** → For narrative summary display

### Why Graceful Degradation?

- FFmpeg might not be installed
- Video processing might fail
- System still provides core value (ML analysis)

### Why Subtitle Files?

- Standard format (.srt)
- Works with all video players
- Alternative if FFmpeg unavailable
- Can be styled by frontend

## 🔐 Error Handling Strategy

```
Try ML Analysis
├─ Success → Continue
└─ Failure → Return error, update DB

Try Video Annotation (optional)
├─ Success → Include in response
└─ Failure → Warn, continue without it

Always Return
├─ ML results (required)
├─ Storyline (required)
├─ Annotated video (optional)
└─ Subtitle file (optional)
```

This ensures the system is **resilient** and **production-ready**! 🚀
