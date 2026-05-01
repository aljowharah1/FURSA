import { useState } from 'react';
import styles from './PreferencesForm.module.css';

interface Preferences {
  preferredLocations: string[];
  preferredIndustries: string[];
  preferredRoleTypes: string[];
}

interface PreferencesFormProps {
  preferences: Preferences;
  onUpdate: (prefs: Partial<Preferences>) => void;
}

const LOCATIONS = ['Riyadh', 'Remote', 'Jeddah', 'Dammam', 'Dhahran'];
const INDUSTRIES = ['Tech', 'AI/ML', 'Finance', 'Healthcare', 'Energy', 'Government'];
const ROLE_TYPES = ['Software', 'Data Science', 'Business', 'Research', 'Design'];

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (updated: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={styles.group}>
      <div className={styles.groupLabel}>{label}</div>
      <div className={styles.checkboxGrid}>
        {options.map((opt) => {
          const isChecked = selected.includes(opt);
          return (
            <label
              key={opt}
              className={`${styles.checkboxLabel} ${isChecked ? styles.checkboxLabelChecked : ''}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(opt)}
              />
              <span className={`${styles.check} ${isChecked ? styles.checkActive : ''}`}>
                {isChecked ? '\u2713' : ''}
              </span>
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function PreferencesForm({ preferences, onUpdate }: PreferencesFormProps) {
  const [locations, setLocations] = useState(preferences.preferredLocations);
  const [industries, setIndustries] = useState(preferences.preferredIndustries);
  const [roleTypes, setRoleTypes] = useState(preferences.preferredRoleTypes);

  const handleSave = () => {
    onUpdate({
      preferredLocations: locations,
      preferredIndustries: industries,
      preferredRoleTypes: roleTypes,
    });
  };

  return (
    <div className={styles.form}>
      <CheckboxGroup
        label="Preferred Locations"
        options={LOCATIONS}
        selected={locations}
        onChange={setLocations}
      />
      <CheckboxGroup
        label="Preferred Industries"
        options={INDUSTRIES}
        selected={industries}
        onChange={setIndustries}
      />
      <CheckboxGroup
        label="Preferred Role Types"
        options={ROLE_TYPES}
        selected={roleTypes}
        onChange={setRoleTypes}
      />
      <button className={styles.updateBtn} onClick={handleSave}>
        Update Preferences
      </button>
    </div>
  );
}
