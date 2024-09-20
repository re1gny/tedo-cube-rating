import { FTClient } from "ft-client";
import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import logo from "./assets/logo.svg";
import styles from "./App.module.scss";

const LEADERBOARD_ENDPOINT_URL = "https://ft-admin-api.sjuksin.ru/";
const LEADERBOARD_PROJECT_ID = "tedo-cube-event";

const ftClient = new FTClient(LEADERBOARD_ENDPOINT_URL, LEADERBOARD_PROJECT_ID);

function SearchInput(props) {
  const { value, placeholder, onChange } = props;
  const [opened, setOpened] = useState(false);
  const inputRef = useRef();

  function handleChange(e) {
    onChange?.(e.target.value);
  }

  function handleOpen() {
    setOpened(true);
    inputRef.current?.focus?.();
  }

  function handleClose() {
    setOpened(false);
  }

  const handleToggle = opened ? handleClose : handleOpen;

  return (
    <div className={styles.inputContainer}>
      <div className={classNames(styles.inputWrapper, opened && styles.opened)}>
        <svg
          className={styles.inputIcon}
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleToggle}
        >
          <circle
            cx="19.3182"
            cy="19.3181"
            r="11.7727"
            stroke="white"
            stroke-width="5"
          />
          <path
            d="M34.4545 34.4544L29.4091 29.4089"
            stroke="white"
            stroke-width="5"
            stroke-linecap="round"
          />
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export function App() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    const sorted = [...(leaderboard || [])].sort(
      (a, b) => b.totalPoint - a.totalPoint
    );

    if (search) {
      const filtered = sorted.filter((item) =>
        item.id.toString().toLowerCase().includes(search.toLowerCase())
      );

      return filtered;
    }

    return sorted;
  }, [leaderboard, search]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className={styles.loaderWrapper}>
          <svg
            className={styles.loader}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <circle
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="10"
              r="15"
              cx="40"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="1"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.4"
              ></animate>
            </circle>
            <circle
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="10"
              r="15"
              cx="100"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="1"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.2"
              ></animate>
            </circle>
            <circle
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="10"
              r="15"
              cx="160"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="1"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="0"
              ></animate>
            </circle>
          </svg>
        </div>
      );
    }

    if (items.length) {
      return (
        <div className={styles.list}>
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className={styles.item}>
              <div className={styles.info}>
                <span className={styles.number}>{itemIndex + 1}</span>
                <span className={styles.id}>{item.id}</span>
              </div>
              <span className={styles.points}>
                {item.totalPoint.toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  }, [items, isLoading]);

  useEffect(() => {
    setIsLoading(true);

    ftClient
      .loadRecordsPublicData()
      .then(setLeaderboard)
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.wrapper}>
      <img className={styles.logo} src={logo} alt="Логотип" />
      <div className={styles.name}>рейтинг игроков</div>
      <h1 className={styles.title}>«ТеДо Куб»</h1>
      <SearchInput
        placeholder="Введи свой ID"
        value={search}
        onChange={setSearch}
      />
      {content}
    </div>
  );
}
