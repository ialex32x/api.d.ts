
declare namespace dat {
    interface Controller {
        domElement: any
        object: any
        property: string
        options(opt: any): Controller
        name(str: string): Controller
        listen(): Controller
        remove(): Controller
        onChange(cb: (value: any) => void): Controller
        onFinishChange(cb: (value: any) => void): Controller
        setValue(newValue: any): void
        getValue(): any
        updateDisplay(): Controller
        isModified(): boolean
    }

    interface NumberController extends Controller {
        min(value: number): NumberController
        max(value: number): NumberController
        step(value: number): NumberController
    }

    class GUI {
        constructor()
        domElement: any
        width: number
        name: string
        closed: boolean
        add(obj: any, label: string, min?: number, max?: number, step?: number): NumberController
        add(obj: any, label: string, values: Array<any>): Controller
        addColor(obj: any, label: string): Controller
        addFolder(name: string): GUI
        removeFolder(folder: GUI): void
        open(): void
        close(): void
        getRoot(): GUI
        getSaveObject(): any
        destroy(): void
    }
}