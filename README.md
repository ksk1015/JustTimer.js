# JustTimer.js
Timer has interface like audio, video api.

## Version
0.5

## Usage

Initialize with duration(second) parameter.

``` js
var timer = new JustTimer(10);
```

Start timer.

``` js
timer.play();
```

Pause timer.

``` js
timer.pause();
```

Get currentTime(second).

``` js
var currentTime = timer.currentTime;
```

Set currentTime(second).

``` js
timer.currentTime = 5;
```

