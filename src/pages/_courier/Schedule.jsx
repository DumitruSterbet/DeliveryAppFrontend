import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components";
import { useFetchCourierSchedule, useUpdateCourierSchedule } from "@/lib/actions";

import CourierPageTemplate from "./CourierPageTemplate";

const DAYS = [
  { key: "Monday", short: "Mon" },
  { key: "Tuesday", short: "Tue" },
  { key: "Wednesday", short: "Wed" },
  { key: "Thursday", short: "Thu" },
  { key: "Friday", short: "Fri" },
  { key: "Saturday", short: "Sat" },
  { key: "Sunday", short: "Sun" },
];

const EMPTY_TIME = { startTime: "09:00", endTime: "17:00", isActive: false };

const normalizeDay = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const raw = String(value).trim();

  if (!raw) {
    return "";
  }

  if (/^\d+$/.test(raw)) {
    const asNumber = Number(raw);
    const byIndex = DAYS[asNumber - 1] || DAYS[asNumber];
    return byIndex?.key || "";
  }

  const normalized = raw.toLowerCase();
  const match = DAYS.find((day) => day.key.toLowerCase() === normalized || day.short.toLowerCase() === normalized);
  return match?.key || raw;
};

const normalizeTime = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  const parsed = String(value).trim();
  const hhmm = parsed.match(/^(\d{1,2}):(\d{2})/);

  if (!hhmm) {
    return fallback;
  }

  const hour = hhmm[1].padStart(2, "0");
  const minute = hhmm[2];
  return `${hour}:${minute}`;
};

const normalizeSchedule = (payload) => {
  const slots = payload?.slots || payload?.data || payload?.schedule || payload || [];

  const byDay = DAYS.reduce((acc, day) => {
    acc[day.key] = { ...EMPTY_TIME };
    return acc;
  }, {});

  if (!Array.isArray(slots)) {
    return byDay;
  }

  slots.forEach((slot) => {
    const day = normalizeDay(slot?.day || slot?.dayOfWeek || slot?.weekday || slot?.name);

    if (!day || !byDay[day]) {
      return;
    }

    byDay[day] = {
      startTime: normalizeTime(slot?.startTime || slot?.from || slot?.start, EMPTY_TIME.startTime),
      endTime: normalizeTime(slot?.endTime || slot?.to || slot?.end, EMPTY_TIME.endTime),
      isActive: Boolean(
        slot?.isActive ?? slot?.isAvailable ?? slot?.enabled ?? slot?.active ?? slot?.available
      ),
    };
  });

  return byDay;
};

const toApiPayload = (draft) =>
  DAYS.map(({ key }) => ({
    dayOfWeek: key,
    startTime: draft[key].startTime,
    endTime: draft[key].endTime,
    isAvailable: draft[key].isActive,
  }));

export default function Schedule() {
  const { data, isPending, isError, error } = useFetchCourierSchedule();
  const { mutate: updateSchedule, isPending: isSaving } = useUpdateCourierSchedule();

  const normalizedInitialState = useMemo(() => normalizeSchedule(data), [data]);
  const [scheduleByDay, setScheduleByDay] = useState(normalizedInitialState);

  useEffect(() => {
    setScheduleByDay(normalizedInitialState);
  }, [normalizedInitialState]);

  const hasValidationError = useMemo(
    () =>
      DAYS.some(({ key }) => {
        const item = scheduleByDay[key];
        if (!item?.isActive) {
          return false;
        }

        return item.startTime >= item.endTime;
      }),
    [scheduleByDay]
  );

  const onChangeSlot = (day, patch) => {
    setScheduleByDay((current) => ({
      ...current,
      [day]: {
        ...current[day],
        ...patch,
      },
    }));
  };

  const onSave = () => {
    if (hasValidationError) {
      return;
    }

    updateSchedule(toApiPayload(scheduleByDay));
  };

  return (
    <CourierPageTemplate
      title="Schedule"
      description="Manage your working schedule and preferred availability windows."
    >
      <div className="space-y-4">
        {isPending ? (
          <div className="rounded-xl border border-divider/30 bg-main/20 p-4 text-sm text-secondary">Loading schedule...</div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-400/30 bg-main/20 p-4 text-sm text-red-400">
            {error?.response?.data?.message || error?.message || "Unable to load schedule."}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-divider/30">
          <table className="w-full min-w-[620px]">
            <thead className="bg-main/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary">Day</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary">Start</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-secondary">End</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map(({ key }) => {
                const slot = scheduleByDay[key] || EMPTY_TIME;
                const rowInvalid = slot.isActive && slot.startTime >= slot.endTime;

                return (
                  <tr key={key} className="border-t border-divider/20">
                    <td className="px-4 py-3 text-sm font-medium text-onNeutralBg">{key}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-secondary">
                        <input
                          type="checkbox"
                          checked={slot.isActive}
                          onChange={(event) => onChangeSlot(key, { isActive: event.target.checked })}
                        />
                        Active
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={slot.startTime}
                        disabled={!slot.isActive}
                        onChange={(event) => onChangeSlot(key, { startTime: event.target.value })}
                        className="w-full rounded border border-divider/50 bg-transparent px-2 py-1 text-sm text-onNeutralBg outline-none disabled:opacity-40"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={slot.endTime}
                        disabled={!slot.isActive}
                        onChange={(event) => onChangeSlot(key, { endTime: event.target.value })}
                        className="w-full rounded border border-divider/50 bg-transparent px-2 py-1 text-sm text-onNeutralBg outline-none disabled:opacity-40"
                      />
                      {rowInvalid ? (
                        <p className="mt-1 text-xs text-red-400">End time must be later than start time.</p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button
            label="Save Schedule"
            variant="contained"
            onClick={onSave}
            disabled={hasValidationError}
            isSubmitting={isSaving}
          />
        </div>
      </div>
    </CourierPageTemplate>
  );
}
