import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { TASK_ID } from '../Utils/Global';
import { getLocation } from '../Utils/requestLocationPermission';


export const onStop = () => {
  // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
  if (ReactNativeForegroundService.is_task_running(TASK_ID)) {
    ReactNativeForegroundService.remove_task(TASK_ID);
  }
  // Stoping Foreground service.
  return ReactNativeForegroundService.stop();
};

export const onStart = (raiseAnAlarmNotificationWhenConditionsAreMet) => {
  console.log('TASK ID is:' + TASK_ID);
  // Checking if the task i am going to create already exist and running, which means that the foreground is also running.
  if (ReactNativeForegroundService.is_task_running(TASK_ID)) {
    return;
  }
  ReactNativeForegroundService.add_task(
    async () => {
      console.log("Tache a ajouter.");
      performTask(raiseAnAlarmNotificationWhenConditionsAreMet);
    },
    {
      delay: 20000,
      onLoop: true,
      taskId: TASK_ID,
      onError: e => console.log('Error logging:', e),
    },
  );
  // starting  foreground service.
  return ReactNativeForegroundService.start({
    id: TASK_ID,
    title: 'Alert Service',
    message:
      'Your location is being used in background to notify you at a particular location.',
  });
};

const performTask = async (raiseAnAlarmNotificationWhenConditionsAreMet) => {
  getLocation().then(async res => {
    raiseAnAlarmNotificationWhenConditionsAreMet(res.coords);
  });
};

