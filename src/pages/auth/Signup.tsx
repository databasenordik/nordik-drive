import React, { useEffect, useRef, useState } from "react";
import useSignupVerification, { signupRequestKey } from "../../hooks/useSignupVerification";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button, TextField, Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthWrapper, FormWrapper } from "../../components/Wrappers";
import { LinkButton } from "../../components/Links";
import TextGroup from "../../components/TextGroup";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import { AuthContainer } from "../../components/containers/Containers";
import toast from "react-hot-toast";
import { apiUrl } from "../../config/api";
import { SIGNUP_SUCCESS_MESSAGE } from "./messages";

import {
  color_secondary,
  color_text_primary,
  color_text_secondary,
  color_white,
  color_border,
} from "../../constants/colors";

import {
  AuthLogosHeader,
  AuthTitle,
  AuthControlledTextField,
  AuthPasswordField,
  AuthPrimaryButton,
  OrDivider,
} from "./AuthShared";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { apiEnsure } from "../../store/api/apiSlice";
import { normalizeEmail, trimmedEmailSchema } from "./authValidation";

type SignupFormValues = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  community: string[];
};

const passwordLengthMessage = "Password must be between 6 and 16 characters";

const schema: yup.ObjectSchema<SignupFormValues> = yup.object({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  email: trimmedEmailSchema,
  password: yup
    .string()
    .required("Password is required")
    .min(6, passwordLengthMessage)
    .max(16, passwordLengthMessage),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  // Keep community optional for users while preserving a stable string[] form value.
  community: yup.array().of(yup.string().trim().defined()).required(),
});

function Signup() {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      community: [],
    },
  });

  const { data, loading, error, fetchData } = useFetch(
    apiUrl("user/signup"),
    "POST",
    false
  );

  const verification = useSignupVerification(watch("email"));
  const [step, setStep] = useState<"details" | "verification">("details");
  const [pendingDetails, setPendingDetails] = useState<SignupFormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submissionActive = useRef(false);
  const busy = loading || verification.loading || submitting;
  const signupAttempt = useRef<{ fingerprint: string; key: string } | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      apiEnsure({
        key: "communities",
        url: apiUrl("communities"),
        method: "GET",
      })
    );
  }, [dispatch]);

  const { fetchData: addCommunity } = useFetch(
    apiUrl("communities"),
    "POST",
    false
  );

  const navigate = useNavigate();
  
  const communityOptions = useSelector((state: RootState) =>
    ((state as any)?.api?.entries["communities"]?.data?.communities || []).map((c: any) => c.name)
  );

  const normalizeName = (v: any) => (typeof v === "string" ? v.trim() : "");
  const existsInOptions = (name: string) =>
  (communityOptions || []).some((o: string) => o.trim().toLowerCase() === name.trim().toLowerCase());

  const onSubmit: SubmitHandler<SignupFormValues> = async (formData) => {
    if (submissionActive.current) return;
    submissionActive.current = true;
    setSubmitting(true);
    try {
      const details = { ...formData, email: normalizeEmail(formData.email), community: [...formData.community] };
      setPendingDetails(details);
      if (verification.challenge?.email === details.email && !verification.codeExpired) {
        setStep("verification");
      } else if (await verification.requestCode()) {
        setStep("verification");
      }
    } finally {
      submissionActive.current = false;
      setSubmitting(false);
    }
  };

  const createAccount = async (formData: SignupFormValues, proof: string) => {
    const cleaned = (formData.community || [])
      .map((x) => (x || "").trim())
      .filter((x) => x.length > 0);

    const seen = new Set<string>();
    const unique = cleaned.filter((n) => {
      const k = n.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    const missing = unique.filter((name) => !existsInOptions(name));

    if (missing.length > 0) {
      await addCommunity({ communities: missing }, null, true);
      dispatch(
      apiEnsure({
        key: "communities",
        url: apiUrl("communities"),
        method: "GET",
        force: true
      })
    );
    }

    const payload = { ...formData, email: normalizeEmail(formData.email), community: unique, signup_verification_token: proof };
    const fingerprint = JSON.stringify(payload);
    if (!signupAttempt.current || signupAttempt.current.fingerprint !== fingerprint) signupAttempt.current = { fingerprint, key: signupRequestKey() };
    await fetchData(payload, null, true, { headers: { "Idempotency-Key": signupAttempt.current.key } });
  };

  const finishSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionActive.current || !pendingDetails) return;
    submissionActive.current = true;
    setSubmitting(true);
    try {
      const proof = verification.verified && verification.token && verification.expiresAt > Date.now()
        ? verification.token
        : (await verification.verifyCode())?.token;
      if (proof) await createAccount(pendingDetails, proof);
    } finally {
      submissionActive.current = false;
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data) {
      toast.success(SIGNUP_SUCCESS_MESSAGE);
      navigate("/");
    }
  }, [data, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <AuthContainer>
      <Loader loading={busy} />

      <AuthWrapper>
        <AuthLogosHeader mb={1.25} />

        <AuthTitle fontSize={22} mb={1.5}>
          {step === "details" ? "Create a new account" : "Verify your email"}
        </AuthTitle>

        <FormWrapper onSubmit={step === "details" ? handleSubmit(onSubmit) : finishSignup} noValidate>
          {step === "details" ? <>
          <TextGroup>
            <AuthControlledTextField
              name="firstname"
              control={control as any}
              label="First name"
              errorMessage={errors.firstname?.message}
              textFieldProps={{ style: { width: "50%" } }}
            />

            <AuthControlledTextField
              name="lastname"
              control={control as any}
              label="Last name"
              errorMessage={errors.lastname?.message}
              textFieldProps={{ style: { width: "50%" } }}
            />
          </TextGroup>

          <AuthControlledTextField
            name="email"
            control={control as any}
            label="Email address"
            errorMessage={errors.email?.message}
          />
          <TextGroup>
            <AuthPasswordField
              name="password"
              control={control as any}
              label="Password"
              errorMessage={errors.password?.message}
            />

            <AuthPasswordField
              name="confirmPassword"
              control={control as any}
              label="Confirm Password"
              errorMessage={errors.confirmPassword?.message}
            />
          </TextGroup>

          {/* Community Info Card */}
          <Box
            sx={{
              width: "100%",
              mt: 1.5,
              mb: 0.75,
              p: 1.5,
              borderRadius: 2,
              border: `1px solid ${color_border}`,
              backgroundColor: "#F7F8FA",
            }}
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: color_text_primary,
                lineHeight: 1.35,
              }}
            >
              First Nation / Community (you can add more than one)
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: color_text_secondary, mt: 0.5, lineHeight: 1.4 }}>
              Start typing to search the dropdown. If you don’t see it, type the name and press Enter to add.
            </Typography>
          </Box>

          {/* Community Rows */}
          <Controller
            name="community"
            control={control}
            render={({ field }) => {
              const items: string[] = Array.isArray(field.value) ? field.value : [];
              const safeItems = items.length === 0 ? [""] : items;

              const setAtIndex = (index: number, raw: any) => {
                const cleanedName = normalizeName(raw);
                const next = [...safeItems];
                next[index] = cleanedName;
                field.onChange(next);
              };

              const addRow = () => field.onChange([...safeItems, ""]);

              const removeRow = (index: number) => {
                const next = safeItems.filter((_, i) => i !== index);
                field.onChange(next.length === 0 ? [""] : next);
              };

              return (
                <Box sx={{ width: "100%", mt: 0.5 }}>
                  {safeItems.map((val, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Autocomplete
                        freeSolo
                        fullWidth
                        options={communityOptions}
                        value={val || ""}
                        onInputChange={(_, newInputValue) => {
                          const next = [...safeItems];
                          next[idx] = newInputValue;
                          field.onChange(next);
                        }}
                        onChange={(_, newValue) => setAtIndex(idx, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={idx === 0 ? "Community" : ""}
                            placeholder="Search or type a community"
                            margin="normal"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: color_white,
                              },
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const v = (e.target as HTMLInputElement).value;
                                setAtIndex(idx, v);
                              }
                            }}
                          />
                        )}
                      />

                      <Button
                        onClick={() => removeRow(idx)}
                        aria-label="Remove community"
                        sx={{
                          minWidth: 44,
                          height: 44,
                          mt: 1,
                          borderRadius: "10px",
                          textTransform: "none",
                          border: `1px solid ${color_border}`,
                          fontWeight: 500,
                          color: color_text_secondary,
                          backgroundColor: `${color_white} !important`,
                          "&:hover": { backgroundColor: "#F7F8FA !important" },
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                    <Button
                      onClick={addRow}
                      sx={{
                        height: 40,
                        textTransform: "none",
                        borderRadius: "10px",
                        fontSize: 14,
                        fontWeight: 500,
                        px: 1.75,
                        border: `1px solid ${color_border}`,
                        color: `${color_secondary} !important`,
                        backgroundColor: `${color_white} !important`,
                        "&:hover": { backgroundColor: "#F7F8FA !important" },
                      }}
                    >
                      + Add another community
                    </Button>

                    <Typography sx={{ fontSize: "0.85rem", color: color_text_secondary }}>
                      If not listed, type and press Enter.
                    </Typography>
                  </Box>
                </Box>
              );
            }}
          />

          <AuthPrimaryButton type="submit" disabled={busy} sx={{ mt: 2, mb: 1.25 }}>
            Sign up
          </AuthPrimaryButton>
          </> : <>
            <Typography sx={{ color: color_text_secondary, textAlign: "center", mb: 1 }}>
              Enter the six-digit code sent to {pendingDetails?.email}.
            </Typography>
            <TextField
              label="Verification code"
              value={verification.code}
              onChange={(event) => verification.setCode(event.target.value)}
              autoComplete="one-time-code"
              autoFocus
              fullWidth
              margin="normal"
              inputProps={{ inputMode: "numeric", maxLength: 6 }}
              disabled={busy}
              error={Boolean(verification.error)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: color_white } }}
            />
            {verification.codeExpired ? <Typography role="status" color="error">
              Your code expired. Request a new code.
            </Typography> : null}
            <AuthPrimaryButton type="submit" disabled={busy} sx={{ mt: 2, mb: 1.25 }}>
              Verify and sign up
            </AuthPrimaryButton>
            <Button type="button" disabled={busy || verification.secondsUntilResend > 0}
              onClick={() => verification.requestCode()} sx={{ color: color_secondary, textTransform: "none" }}>
              {verification.secondsUntilResend > 0 ? `Resend in ${verification.secondsUntilResend}s` : "Resend code"}
            </Button>
            <Button type="button" disabled={busy} sx={{ color: color_secondary, textTransform: "none" }}
              onClick={() => { setStep("details"); verification.setCode(""); }}>
              Edit details
            </Button>
          </>}
          {verification.error ? <Typography role="alert" color="error">{verification.error}</Typography> : null}

          <OrDivider my={1.75} dividerColor={color_border} textColor={color_text_secondary} />

          <Box sx={{ textAlign: "center", mb: 0.5 }}>
            <LinkButton role="button" onClick={() => navigate("/")}>
              Already have an account?
            </LinkButton>
          </Box>
        </FormWrapper>
      </AuthWrapper>
    </AuthContainer>
  );
}

export default Signup;
