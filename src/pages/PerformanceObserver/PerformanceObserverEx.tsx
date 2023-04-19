import { useCallback, useEffect, useState } from "react";
import { Button, List, ListItem, Typography } from "@mui/material";

function throttle(func, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

const MyComponent = () => {
  const [performanceEntries, setPerformanceEntries] = useState<
    PerformanceEntry[]
  >([]);
  const [shiftContent, setShiftContent] = useState(false);

  const recordPerformanceEntry = useCallback((entry: PerformanceEntry) => {
    setPerformanceEntries((prevPerfEntries) => {
      const timestamp = performance.timeOrigin + entry.startTime;
      const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      }).format(timestamp);

      const newPerformanceEntries = [
        ...prevPerfEntries,
        {
          id: entry.startTime,
          value: entry.value,
          time: formattedTime,
          type: entry.entryType,
        },
      ];
      return newPerformanceEntries.slice(-5);
    });
  }, []);

  const throttledRecordPeformanceEntry = useCallback(
    throttle(recordPerformanceEntry, 50),
    [setPerformanceEntries, recordPerformanceEntry]
  );

  useEffect(() => {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.entryType === "layout-shift") {
          throttledRecordPeformanceEntry(entry);
        } else {
          recordPerformanceEntry(entry);
        }
      }
    });

    observer.observe({ type: "layout-shift", buffered: true });
    observer.observe({ type: "mark" });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleToggleShift = () => {
    setShiftContent((prevShiftContent) => !prevShiftContent);
  };

  const handleCustomMark = () => {
    performance.mark("myTask", {
      startTime: performance.now(),
      detail: { value: performance.now() },
    });
  };

  return (
    <div>
      <Typography variant="h4">Performance Observer</Typography>
      <Button onClick={handleToggleShift} variant="contained" color="primary">
        Toggle Layout Shift
      </Button>
      <Button onClick={handleCustomMark} variant="contained" color="primary">
        Enter custom mark
      </Button>
      <div
        style={{ marginTop: shiftContent ? "100px" : "0px", height: "100px" }}
      >
        <Typography variant="h5">Last 5 Layout Shifts:</Typography>
        <List style={{ height: "fit-content" }}>
          {performanceEntries.map((entry) => (
            <ListItem key={entry.id} style={{ height: "1.5rem" }}>
              <Typography>
                {entry.type === "layout-shift"
                  ? "Layout shift:"
                  : "Custom mark:"}{" "}
                {entry.value?.toFixed(4)} at {entry.time}
              </Typography>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default MyComponent;
