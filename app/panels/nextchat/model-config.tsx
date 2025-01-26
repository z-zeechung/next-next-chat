import { useApiConfig } from "@/app/client/api"
import { Input, List, Select, Typography } from "antd"

export const ModelConfig = {
    Providers() {
        const apiConfig = useApiConfig()
        return <>
            <div style={{ height: 20 }} />
            <Typography.Title level={3}>账户信息</Typography.Title>
            <hr />
            {apiConfig.getFields().map(p => <>
                <div style={{ height: 16 }} />
                <Typography.Title level={4}>{apiConfig.getProviderName(p.provider)}</Typography.Title>
                <List
                    itemLayout="horizontal"
                    dataSource={p.fields}
                    renderItem={(item, idx) => <List.Item>
                        <List.Item.Meta
                            title={<b>{item + ":"}</b>}
                        />
                        <Input
                            value={apiConfig.getField(p.provider, item) ?? ""}
                            onChange={(e) => { apiConfig.setField(p.provider, item, e.currentTarget.value) }}
                        />
                    </List.Item>}
                />
                <hr />
            </>)}
        </>
    },
    Models() {
        const apiConfig = useApiConfig()
        return <>
            <div style={{ height: 20 }} />
            <Typography.Title level={4}>文字模型</Typography.Title>
            <List
                header={<Typography.Title level={5}>常规模型</Typography.Title>}
                dataSource={[
                    {
                        name: "服务商：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={[
                                ...(apiConfig.getProvider("chat") ? [] : [undefined]),
                                ...apiConfig.getProviders("chat")
                            ].map(t => { return { value: t ?? "", label: apiConfig.getProviderName(t) ?? "选择服务商……" } })}
                            value={apiConfig.getProvider("chat") ?? ""}
                            onChange={(v) => {
                                if (v == "") return
                                apiConfig.setProvider("chat", v)
                            }}
                        />
                    },
                    ...(apiConfig.getProvider("chat") ? [{
                        name: "模型：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={apiConfig.getModels("chat").map(t => { return { value: t, label: t } })}
                            value={apiConfig.getModel("chat")}
                            onChange={(v) => { apiConfig.setModel("chat", v) }}
                        />
                    }] : [])
                ]}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        title={<b>{item.name}</b>}
                    />
                    {item.elem}
                </List.Item>}
            />
            <List
                header={<Typography.Title level={5}>高级模型</Typography.Title>}
                dataSource={[
                    {
                        name: "服务商：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={[
                                ...(apiConfig.getProvider("chat-smart") ? [] : [undefined]),
                                ...apiConfig.getProviders("chat-smart")
                            ].map(t => { return { value: t ?? "", label: apiConfig.getProviderName(t) ?? "选择服务商……" } })}
                            value={apiConfig.getProvider("chat-smart") ?? ""}
                            onChange={(v) => {
                                if (v == "") return
                                apiConfig.setProvider("chat-smart", v)
                            }}
                        />
                    },
                    ...(apiConfig.getProvider("chat-smart") ? [{
                        name: "模型：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={apiConfig.getModels("chat-smart").map(t => { return { value: t, label: t } })}
                            value={apiConfig.getModel("chat-smart")}
                            onChange={(v) => { apiConfig.setModel("chat-smart", v) }}
                        />
                    }] : [])
                ]}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        title={<b>{item.name}</b>}
                    />
                    {item.elem}
                </List.Item>}
            />
            <List
                header={<Typography.Title level={5}>长文本模型</Typography.Title>}
                dataSource={[
                    {
                        name: "服务商：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={[
                                ...(apiConfig.getProvider("chat-long") ? [] : [undefined]),
                                ...apiConfig.getProviders("chat-long")
                            ].map(t => { return { value: t ?? "", label: apiConfig.getProviderName(t) ?? "选择服务商……" } })}
                            value={apiConfig.getProvider("chat-long") ?? ""}
                            onChange={(v) => {
                                if (v == "") return
                                apiConfig.setProvider("chat-long", v)
                            }}
                        />
                    },
                    ...(apiConfig.getProvider("chat-long") ? [{
                        name: "模型：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={apiConfig.getModels("chat-long").map(t => { return { value: t, label: t } })}
                            value={apiConfig.getModel("chat-long")}
                            onChange={(v) => { apiConfig.setModel("chat-long", v) }}
                        />
                    }] : [])
                ]}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        title={<b>{item.name}</b>}
                    />
                    {item.elem}
                </List.Item>}
            />
            <div style={{ height: 20 }} />
            <Typography.Title level={4}>视觉模型</Typography.Title>
            <List
                dataSource={[
                    {
                        name: "服务商：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={[
                                ...(apiConfig.getProvider("caption") ? [] : [undefined]),
                                ...apiConfig.getProviders("caption")
                            ].map(t => { return { value: t ?? "", label: apiConfig.getProviderName(t) ?? "选择服务商……" } })}
                            value={apiConfig.getProvider("caption") ?? ""}
                            onChange={(v) => {
                                if (v == "") return
                                apiConfig.setProvider("caption", v)
                            }}
                        />
                    },
                    ...(apiConfig.getProvider("caption") ? [{
                        name: "模型：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={apiConfig.getModels("caption").map(t => { return { value: t, label: t } })}
                            value={apiConfig.getModel("caption")}
                            onChange={(v) => { apiConfig.setModel("caption", v) }}
                        />
                    }] : [])
                ]}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        title={<b>{item.name}</b>}
                    />
                    {item.elem}
                </List.Item>}
            />
            <div style={{ height: 20 }} />
            <Typography.Title level={4}>绘画模型</Typography.Title>
            <List
                dataSource={[
                    {
                        name: "服务商：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={[
                                ...(apiConfig.getProvider("paint") ? [] : [undefined]),
                                ...apiConfig.getProviders("paint")
                            ].map(t => { return { value: t ?? "", label: apiConfig.getProviderName(t) ?? "选择服务商……" } })}
                            value={apiConfig.getProvider("paint") ?? ""}
                            onChange={(v) => {
                                if (v == "") return
                                apiConfig.setProvider("paint", v)
                            }}
                        />
                    },
                    ...(apiConfig.getProvider("paint") ? [{
                        name: "模型：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={apiConfig.getModels("paint").map(t => { return { value: t, label: t } })}
                            value={apiConfig.getModel("paint")}
                            onChange={(v) => { apiConfig.setModel("paint", v) }}
                        />
                    }] : [])
                ]}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        title={<b>{item.name}</b>}
                    />
                    {item.elem}
                </List.Item>}
            />
            <div style={{ height: 20 }} />
            <Typography.Title level={4}>搜索接口</Typography.Title>
            <List
                dataSource={[
                    {
                        name: "服务商：",
                        elem: <Select
                            popupMatchSelectWidth={false}
                            options={[
                                ...(apiConfig.getProvider("search") ? [] : [undefined]),
                                ...apiConfig.getProviders("search")
                            ].map(t => { return { value: t ?? "", label: apiConfig.getProviderName(t) ?? "选择服务商……" } })}
                            value={apiConfig.getProvider("search") ?? ""}
                            onChange={(v) => {
                                if (v == "") return
                                apiConfig.setProvider("search", v)
                            }}
                        />
                    }
                ]}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        title={<b>{item.name}</b>}
                    />
                    {item.elem}
                </List.Item>}
            />
        </>
    }
}