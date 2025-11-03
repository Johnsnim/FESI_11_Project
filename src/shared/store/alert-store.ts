    import { create } from "zustand";

    type ButtonVariant = "default" | "destructive" | "outline" | "secondary";

    interface AlertButton {
    label: string;
    variant?: ButtonVariant;
    onClick: () => void;
    }

    interface AlertState {
    open: boolean;
    message: string;
    buttons: AlertButton[];
    }

    interface AlertStore extends AlertState {
    showAlert: (options: {
        message: string;
        buttons: AlertButton[];
    }) => void;
    closeAlert: () => void;
    }

    export const useAlertStore = create<AlertStore>((set) => ({
    open: false,
    message: "",
    buttons: [],

    showAlert: (options) => {
        set({
        open: true,
        message: options.message,
        buttons: options.buttons,
        });
    },

    closeAlert: () => {
        set({ open: false });
    },
    }));

    export const alert = (message: string, onConfirm?: () => void) => {
    useAlertStore.getState().showAlert({
        message,
        buttons: [
        {
            label: "확인",
            variant: "default",
            onClick: () => {
            onConfirm?.();
            },
        },
        ],
    });
    };

    export const confirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
    ) => {
    useAlertStore.getState().showAlert({
        message,
        buttons: [
        {
            label: "취소",
            variant: "outline",
            onClick: () => {
            onCancel?.();
            },
        },
        {
            label: "확인",
            variant: "default",
            onClick: onConfirm,
        },
        ],
    });
    };

    export const confirmDelete = (
    message: string,
    onDelete: () => void,
    onCancel?: () => void
    ) => {
    useAlertStore.getState().showAlert({
        message,
        buttons: [
        {
            label: "취소",
            variant: "outline",
            onClick: () => {
            onCancel?.();
            },
        },
        {
            label: "삭제",
            variant: "destructive",
            onClick: onDelete,
        },
        ],
    });
    };