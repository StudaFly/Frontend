import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Field, Input } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { mfaActivate, mfaSetup, mfaVerify } from "@/core/api/auth";
import { getApiErrorMessage } from "@/core/api/errors";
import { tokenStorage } from "@/core/auth/tokenStorage";

export default function AdminMfaPage() {
    const navigate = useNavigate();
    const { user, startSession } = useAuth();
    const [code, setCode] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
    const remember = localStorage.getItem("refreshToken") !== null;

    const setup = useMutation({
        mutationFn: () => mfaSetup().then((r) => r.data.data),
        onError: (err) => toast.error(getApiErrorMessage(err)),
    });
    const activate = useMutation({
        mutationFn: () => mfaActivate(code.trim()).then((r) => r.data.data),
        onSuccess: (data) => {
            startSession(data, { remember });
            setBackupCodes(data.backupCodes);
            setCode("");
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Code invalide")),
    });
    const verify = useMutation({
        mutationFn: () => mfaVerify(code.trim()).then((r) => r.data.data),
        onSuccess: (data) => {
            startSession(data, { remember });
            navigate("/admin");
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Code invalide")),
    });

    if (!tokenStorage.hasSession()) return null;

    return (
        <div className="mx-auto max-w-lg px-4 py-12">
            <Card title="Double authentification">
                {backupCodes ? (
                    <div className="space-y-4 text-sm">
                        <p className="flex items-center gap-2 font-semibold text-green-700"><ShieldCheck className="h-5 w-5" aria-hidden />MFA activée.</p>
                        <p>Conserve ces codes de secours dans un endroit sûr : chacun ne sert qu'une fois, et ils ne seront plus jamais affichés.</p>
                        <ul className="grid grid-cols-2 gap-2 font-mono">
                            {backupCodes.map((c) => <li key={c} className="rounded bg-gray-100 px-2 py-1 text-center">{c}</li>)}
                        </ul>
                        <Button onClick={() => navigate("/admin")}>J'ai noté mes codes, continuer</Button>
                    </div>
                ) : user?.mfaEnabled ? (
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            verify.mutate();
                        }}
                    >
                        <p className="text-sm text-gray-600">Saisis le code à 6 chiffres de ton application d'authentification, ou un code de secours.</p>
                        <Field label="Code"><Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" required autoFocus /></Field>
                        <Button type="submit" disabled={verify.isPending}>Valider</Button>
                    </form>
                ) : !setup.data ? (
                    <div className="space-y-4 text-sm text-gray-600">
                        <p>La double authentification est obligatoire pour les admins plateforme. Prépare une application comme Google Authenticator, 1Password ou Authy.</p>
                        <Button onClick={() => setup.mutate()} disabled={setup.isPending}>Configurer la double authentification</Button>
                    </div>
                ) : (
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            activate.mutate();
                        }}
                    >
                        <p className="text-sm text-gray-600">Scanne ce QR code avec ton application, puis saisis le code affiché.</p>
                        <div className="flex justify-center rounded-xl bg-white p-4">
                            <QRCodeSVG value={setup.data.otpauthUri} size={200} title="QR code de configuration" />
                        </div>
                        <p className="break-all text-center font-mono text-xs text-gray-500">Clé manuelle : {setup.data.secret}</p>
                        <Field label="Code à 6 chiffres"><Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" required /></Field>
                        <Button type="submit" disabled={activate.isPending}>Activer</Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
