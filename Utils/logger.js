import crashlytics from '@react-native-firebase/crashlytics'

const logger = ({ title, message, data, error }) => {
  crashlytics().log(`[${title}] - ${message}`)

  if (data) crashlytics().log(data)

  if (error) crashlytics().recordError(error)
}

export default logger