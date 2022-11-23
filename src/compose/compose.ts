import {IGetApiLogs, IGetApiSystems} from "@/services/types";
import {Ref, ref} from "vue";
import Requester from "@/services/requester";
import {APIS} from "../../config";
import {message} from "ant-design-vue";
import 'ant-design-vue/lib/message/style/css'

export function useSystems(): Ref<IGetApiSystems['IRes']['data']['systems']> {
  const systems = ref<IGetApiSystems['IRes']['data']['systems']>([])

  const r = new Requester<IGetApiSystems>(APIS.GET_API_SYSTEMS)

  r.get({}).then(v => {
    if (v.success && v.data?.systems.length > 0) {
      systems.value = v.data.systems
    }
  }).catch(e => {
    message.error(e.message)
  })

  return systems
}

export function useLogs(conditions: IGetApiLogs['IReq']): [Ref<IGetApiLogs['IRes']['data']['content']>, Ref<number>, () => void] {
  const logs = ref<IGetApiLogs['IRes']['data']['content']>([])
  const total = ref(0)

  function fetch() {
    const r = new Requester<IGetApiLogs>(APIS.GET_API_LOGS)
    r.get(conditions).then(v => {
      if (v?.data?.content.length > 0) {
        logs.value = v.data.content
        total.value = v.data.total
      }
    }).catch(e => {
      message.error(e.message)
    })
  }

  return [logs, total, fetch]
}
