import { useEffect, useState } from 'react';
import { Button, List, ListItem, Typography } from '@mui/material';

const MyComponent = () => {
  const [layoutShifts, setLayoutShifts] = useState<PerformanceEntry[]>([]);
  const [shiftContent, setShiftContent] = useState(false);

  useEffect(() => {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {

        setLayoutShifts((prevLayoutShifts) => {
          const timestamp = performance.timeOrigin + entry.startTime;
          const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour12: false,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
          }).format(timestamp);

          const newLayoutShifts = [
            ...prevLayoutShifts,
            { id: entry.startTime, value: entry.value, time: formattedTime },
          ];
          return newLayoutShifts.slice(-5);
        });
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleButtonClick = () => {
    setShiftContent((prevShiftContent) => !prevShiftContent);
  };

  return (
    <div>
      <Typography variant="h4">MyComponent</Typography>
      <Button onClick={handleButtonClick} variant="contained" color="primary">
        Toggle Layout Shift
      </Button>
      <div style={{ marginTop: shiftContent ? '100px' : '0px', height: 100 }}>
        <Typography variant="h5">Last 5 Layout Shifts:</Typography>
        <List>
          {layoutShifts.map((shift) => (
            <ListItem key={shift.id} style={{ height: '1.5rem' }}>
              <Typography>
                Layout shift: {shift.value.toFixed(4)} at {shift.time}
              </Typography>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default MyComponent;
