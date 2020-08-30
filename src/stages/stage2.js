import {
  KEY_STAGE_INITIATE,
  KEY_STAGE_IS_WAVE_CLEAN,
  KEY_STAGE_WAVES,
  DEFAULT_FRAME_WIDTH,
  KEY_OBJECT_ON_UPDATE,
  KEY_STAGE_TRANSITION,
  KEY_ENEMY_IS_UNTOUCHABLE,
  KEY_STAGE_ENDING_CUT_SCENE,
  SIDE_T
} from '../constants';
import {
  platforms,
  player,
  cameraCenter,
  $cameraLoop,
  $cameraZoom,
  $stageWave,
  enemies,
  $timeRatio,
  graphics,
  $backgroundV
} from '../state';
import {
  platform,
  boundary,
  followPlayerX,
  followPlayerY,
  horizontalBamboo,
} from '../helper/platform';
import { enemy, compund } from '../helper/enemy';
import { easeInQuint } from '../easing';
import { circularMovement } from '../animation';
import { collision, object, vectorMagnitude, alternateProgress } from '../utils';
import { wipe, staticBamboo } from '../helper/graphic';

export default {
  [KEY_STAGE_INITIATE]() {
    player.p.x = -240;
    cameraCenter.y = player.p.y + 200;
    $cameraLoop.$ = () => {
      cameraCenter.y = Math.min(
        player.p.y - player.s.y / 2 + 200,
        Math.max(player.p.y + player.s.y / 2, cameraCenter.y)
      );
    };
    graphics.push(
      staticBamboo(330, -10, 2900, 1, 1.5, 51, 0.02),
      staticBamboo(30, -10, 2900,  2, 1.2, 51, 0.02),
      staticBamboo(0, 0, 2900,  3, 0.9, 10, 0.02),
      staticBamboo(-67, 0, 3000,  5, 0.7, 10, 0.02),
      staticBamboo(67, -10, 3100,  5, 0.7, 10, 0.02),
      staticBamboo(-200, -10, 3200,  10, 0.5, 10, 0.02),
      staticBamboo(200, -10, 3200,  10, 0.5, 10, 0.02),
    );
    platforms.push(
      platform(0, -player.s.y / 2, player.s.x * 10, 0, {
        [KEY_OBJECT_ON_UPDATE]: [followPlayerX],
      }),
      boundary(DEFAULT_FRAME_WIDTH / 2, 0, 0, player.s.y * 10, {
        [KEY_OBJECT_ON_UPDATE]: [followPlayerY],
      }),
      boundary(-DEFAULT_FRAME_WIDTH / 2, 0, 0, player.s.y * 10, {
        [KEY_OBJECT_ON_UPDATE]: [followPlayerY],
      }),
      horizontalBamboo(-50, 150, 150, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(9000, 0, 15)],
      }),
      horizontalBamboo(120, 300, 200, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(10000, 0, 15)],
      }),
      horizontalBamboo(-120, 450, 200, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(8000, 0, 15)],
      }),
      horizontalBamboo(-50, 610, 180, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(10000, 0, 15)],
      }),
      platform(-180, 800, 0, 200, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(8000, 15, 0)],
      }),
      horizontalBamboo(50, 870, 150, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(9000, 0, 15)],
      }),
      platform(150, 1100, 0, 200, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(8000, 15, 0)],
      }),
      platform(-100, 1400, 0, 500, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(10000, 15, 0)],
      }),
      horizontalBamboo(250, 1350, 150, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(9000, 0, 15)],
      }),
      horizontalBamboo(150, 1620, 150, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(8000, 0, 15)],
      }),
      horizontalBamboo(-50, 1920, 150, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(10000, 0, 15)],
      }),
      horizontalBamboo(-250, 2220, 150, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(9000, 0, 15)],
      }),
      platform(190, 2500, 0, 500, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(8000, 15, 0)],
      }),
      horizontalBamboo(-136, 2900, 200, 0, {
        [KEY_OBJECT_ON_UPDATE]: [circularMovement(10000, 0, 15)],
      })
    );
  },
  [KEY_STAGE_WAVES]: [
    () =>
      enemies.push(
        enemy(25, 790, 30, 30, {
          [KEY_ENEMY_IS_UNTOUCHABLE]: true,
          [KEY_OBJECT_ON_UPDATE]: [circularMovement(3000, 50, 5)],
        }),
        enemy(-20, 1150, 30, 30, {
          [KEY_ENEMY_IS_UNTOUCHABLE]: true,
          [KEY_OBJECT_ON_UPDATE]: [circularMovement(6000, 5, 10)],
        }),
        enemy(150, 1580, 30, 30, {
          [KEY_ENEMY_IS_UNTOUCHABLE]: true,
          [KEY_OBJECT_ON_UPDATE]: [circularMovement(3000, 50, 5)],
        }),
        enemy(75, 1800, 30, 30, {
          [KEY_ENEMY_IS_UNTOUCHABLE]: true,
          [KEY_OBJECT_ON_UPDATE]: [circularMovement(4000, 5, 50)],
        }),
        enemy(-120, 2220, 30, 30, {
          [KEY_ENEMY_IS_UNTOUCHABLE]: true,
          [KEY_OBJECT_ON_UPDATE]: [circularMovement(6000, 80, 80)],
        }),
        enemy(-120, 2800, 30, 30, {
          [KEY_OBJECT_ON_UPDATE]: [circularMovement(6000, 5, 20)],
        })
      ),
  ],
  [KEY_STAGE_IS_WAVE_CLEAN]() {
    const goalArea = object(-136, 2900, 200, 30);
    const collidedSide = collision(goalArea, player, $timeRatio.$);
    return (
      $stageWave.$ === -1 ||
      (collidedSide && Math.round(vectorMagnitude(player.v)) === 0)
    );
  },
  [KEY_STAGE_TRANSITION](progress) {
    player.p.x = -500 * easeInQuint(1 - progress);
  },
  [KEY_STAGE_ENDING_CUT_SCENE]: [
    [() => graphics.push(wipe())],
    [() => {}, 1000]
  ]
};
