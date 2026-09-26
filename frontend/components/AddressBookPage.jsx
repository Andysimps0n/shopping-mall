"use client";

import { useEffect, useRef, useState } from "react";
import AddressSearch from "./AddressSearch";
import ProfileShell from "./ProfileShell";
import RequireProfile from "./RequireProfile";
import { profileCopy } from "@/lib/auth";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  sameSavedAddress,
  updateAddress,
} from "@/lib/addressApi";

const EMPTY_FORM = {
  postalCode: "",
  address1: "",
  address2: "",
};

const FIELD_ERRORS = {
  postal_code_invalid: "우편번호 5자리를 입력해 주세요.",
  address_required: "주소를 입력해 주세요.",
  address_limit: profileCopy.addressLimit,
  address_duplicate: profileCopy.addressDuplicate,
  not_found: "배송지를 찾지 못했습니다.",
  login_required: "로그인 후 저장할 수 있습니다.",
  address_failed: "배송지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
};

export default function AddressBookPage() {
  return (
    <RequireProfile>
      {() => (
        <ProfileShell title={profileCopy.address} backHref="/profile/account">
          <AddressBook />
        </ProfileShell>
      )}
    </RequireProfile>
  );
}

function AddressBook() {
  const [addresses, setAddresses] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [listError, setListError] = useState("");
  const defaultRequest = useRef(0);

  useEffect(() => {
    let ignore = false;
    fetchAddresses().then((next) => {
      if (ignore) return;
      if (!next) {
        setLoadError(true);
        setAddresses([]);
        return;
      }
      setAddresses(next);
    });
    return () => {
      ignore = true;
    };
  }, []);

  function openCreate() {
    setFormError("");
    setEditingId("");
    setForm({ ...EMPTY_FORM });
  }

  function openEdit(address) {
    setFormError("");
    setEditingId(address.id);
    setForm({
      postalCode: address.postalCode,
      address1: address.address1,
      address2: address.address2 || "",
    });
  }

  async function chooseDefault(address) {
    if (!addresses || address.isDefault) return;

    const requestId = defaultRequest.current + 1;
    defaultRequest.current = requestId;
    setListError("");
    setAddresses((current) => {
      const chosen = current.find((item) => item.id === address.id);
      if (!chosen) return current;
      const rest = current.filter((item) => item.id !== address.id);
      return [
        { ...chosen, isDefault: true },
        ...rest.map((item) => ({ ...item, isDefault: false })),
      ];
    });

    const result = await updateAddress(address.id, {
      postalCode: address.postalCode,
      address1: address.address1,
      address2: address.address2 || "",
      isDefault: true,
    });
    if (requestId !== defaultRequest.current) return;

    if (!result.ok) {
      setListError(FIELD_ERRORS[result.error] || FIELD_ERRORS.address_failed);
      const next = await fetchAddresses();
      if (requestId !== defaultRequest.current) return;
      if (next) setAddresses(next);
      return;
    }

    setAddresses(result.addresses);
  }

  async function save(event) {
    event.preventDefault();
    if (!form || saving) return;
    const taken = (addresses || []).some(
      (address) => address.id !== editingId && sameSavedAddress(form, address),
    );
    if (taken) {
      setFormError(FIELD_ERRORS.address_duplicate);
      return;
    }

    setSaving(true);
    setFormError("");

    const result = editingId
      ? await updateAddress(editingId, form)
      : await createAddress(form);

    setSaving(false);
    if (!result.ok) {
      setFormError(FIELD_ERRORS[result.error] || FIELD_ERRORS.address_failed);
      return;
    }
    setAddresses(result.addresses);
    setForm(null);
    setEditingId("");
  }

  async function remove(address) {
    const label = address.address1;
    if (!window.confirm(`${label} 배송지를 삭제할까요?`)) return;
    const result = await deleteAddress(address.id);
    if (!result.ok) {
      setFormError(FIELD_ERRORS[result.error] || FIELD_ERRORS.address_failed);
      return;
    }
    setAddresses(result.addresses);
    if (editingId === address.id) {
      setForm(null);
      setEditingId("");
    }
  }

  if (addresses == null && !loadError) {
    return <p className="login-lead">{profileCopy.loading}</p>;
  }

  return (
    <>
      <p className="login-lead">{profileCopy.addressLead}</p>
      {loadError ? (
        <p className="checkout-error" role="alert">
          {FIELD_ERRORS.address_failed}
        </p>
      ) : null}

      {listError ? (
        <p className="checkout-error" role="alert">
          {listError}
        </p>
      ) : null}

      {addresses.length === 0 ? (
        <p className="login-lead">{profileCopy.addressEmpty}</p>
      ) : (
        <fieldset className="address-picker address-book-list">
          <legend className="login-field-label">{profileCopy.addressDefault}</legend>
          {addresses.map((address) => (
            <div key={address.id} className="address-row">
              <label className="address-default-choice">
                <input
                  type="radio"
                  name="defaultAddress"
                  checked={address.isDefault}
                  onChange={() => chooseDefault(address)}
                />
                <span className="address-choice-body">
                  <span className="address-choice-name">{address.address1}</span>
                  <span className="address-choice-meta">
                    ({address.postalCode}) {address.address2}
                  </span>
                </span>
              </label>
              <div className="address-book-actions">
                <button type="button" className="address-text-button" onClick={() => openEdit(address)}>
                  {profileCopy.addressEdit}
                </button>
                <button type="button" className="address-text-button" onClick={() => remove(address)}>
                  {profileCopy.addressDelete}
                </button>
              </div>
            </div>
          ))}
        </fieldset>
      )}

      {form ? (
        <AddressForm
          form={form}
          setForm={setForm}
          editing={Boolean(editingId)}
          saving={saving}
          error={formError}
          onSubmit={save}
          onCancel={() => {
            setForm(null);
            setEditingId("");
            setFormError("");
          }}
        />
      ) : (
        <button type="button" className="button address-add" onClick={openCreate}>
          {profileCopy.addressAdd}
        </button>
      )}
    </>
  );
}

function AddressForm({ form, setForm, editing, saving, error, onSubmit, onCancel }) {
  const [postcodeOpen, setPostcodeOpen] = useState(false);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form className="address-book-form" onSubmit={onSubmit}>
      <div className="checkout-postal">
        <label className="login-field">
          <span className="login-field-label">우편번호</span>
          <input
            name="postalCode"
            required
            inputMode="numeric"
            maxLength={5}
            value={form.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
          />
        </label>
        <button
          type="button"
          className="button button--secondary checkout-postal-button"
          onClick={() => setPostcodeOpen(true)}
        >
          주소 검색
        </button>
      </div>

      <label className="login-field">
        <span className="login-field-label">주소</span>
        <input
          name="address1"
          required
          value={form.address1}
          onChange={(event) => updateField("address1", event.target.value)}
        />
      </label>

      <label className="login-field">
        <span className="login-field-label">상세 주소</span>
        <input
          name="address2"
          value={form.address2}
          onChange={(event) => updateField("address2", event.target.value)}
        />
      </label>

      {error ? (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="address-book-actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? profileCopy.addressSaving : editing ? "수정 내용 저장" : profileCopy.addressSave}
        </button>
        <button type="button" className="button button--secondary" onClick={onCancel}>
          {profileCopy.addressCancel}
        </button>
      </div>

      {postcodeOpen ? (
        <AddressSearch
          onComplete={({ postalCode, address1 }) => {
            setForm((current) => ({ ...current, postalCode, address1 }));
            setPostcodeOpen(false);
          }}
          onClose={() => setPostcodeOpen(false)}
        />
      ) : null}
    </form>
  );
}
