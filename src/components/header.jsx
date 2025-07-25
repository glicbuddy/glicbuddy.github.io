import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import config from '@/config'
import logo from '/logo.svg'

export const Header = () => (
  <CardHeader className="text-center justify-center w-full">
    <CardTitle className="text-lg font-bold">
      <img
        src={logo}
        className="h-16 mb-2 mx-auto"
        alt={`${config.appName} | ${config.appDescription}`}
        title={`${config.appName} | ${config.appDescription}`}
      />
      {config.appName}
    </CardTitle>
    <CardDescription>{config.appDescription}</CardDescription>
  </CardHeader>
)
