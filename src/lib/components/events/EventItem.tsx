import { Fragment, MouseEvent, useMemo, useState } from "react";
import { Popover, Typography, ButtonBase, useTheme, IconButton, Button } from "@mui/material";
import { format } from "date-fns";
import { ProcessedEvent, SchedulerHelpers } from "../../types";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import { EventItemPapper, PopperInner } from "../../styles/styles";
import EventActions from "./Actions";
import { differenceInDaysOmitTime } from "../../helpers/generals";
import useStore from "../../hooks/useStore";
import useDragAttributes from "../../hooks/useDragAttributes";
import axios from "axios";
import { handleOpenVentas } from "../../functions/NewWindow";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useClientes } from "../../hooks/useClientes";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { putCitaEstado } from "../../functions/Citas";
import { useEstatusCitas } from "../../hooks/useEstatusCitas";
import ChecklistIcon from "@mui/icons-material/Checklist";
interface EventItemProps {
  event: ProcessedEvent;
  multiday: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  showdate?: boolean;
}

const EventItem = ({ event, multiday, hasPrev, hasNext, showdate }: EventItemProps) => {
  const {
    triggerDialog,
    onDelete,
    events,
    handleState,
    triggerLoading,
    customViewer,
    viewerExtraComponent,
    fields,
    direction,
    resources,
    resourceFields,
    locale,
    viewerTitleComponent,
    editable,
    deletable,
    hourFormat,
    eventRenderer,
    onEventClick,
    view,
    draggable,
    translations,
    customEditor,
  } = useStore();
  const dragProps = useDragAttributes(event);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const hFormat = hourFormat === "24" ? "hh:mm a" : "HH:mm";

  const NextArrow = direction === "rtl" ? ArrowLeftRoundedIcon : ArrowRightRoundedIcon;
  const PrevArrow = direction === "rtl" ? ArrowRightRoundedIcon : ArrowLeftRoundedIcon;
  const hideDates = differenceInDaysOmitTime(event.start, event.end) <= 0 && event.allDay;

  const triggerViewer = (el?: MouseEvent<Element>) => {
    if (!el?.currentTarget && deleteConfirm) {
      setDeleteConfirm(false);
    }
    setAnchorEl(el?.currentTarget || null);
  };

  const handleDelete = async () => {
    try {
      triggerLoading(true);
      let deletedId = event.event_id;
      axios
        .delete(`http://localhost:3000/events/${event.event_id}`)
        .then(() => console.log("EVENTO BORRADA"))
        .catch((e) => console.log(e));
      // Trigger custom/remote when provided
      if (onDelete) {
        const remoteId = await onDelete(deletedId);
        if (remoteId) {
          deletedId = remoteId;
        } else {
          deletedId = "";
        }
      }
      if (deletedId) {
        triggerViewer();
        const updatedEvents = events.filter((e) => e.event_id !== deletedId);
        handleState(updatedEvents, "events");
      }
    } catch (error) {
      console.error(error);
    } finally {
      triggerLoading(false);
    }
  };
  const { estatusCitas } = useEstatusCitas();

  const [anchorEls, setAnchorEls] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEls);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEls(event.currentTarget);
    console.log("A");
  };
  const idSuc = new URLSearchParams(window.location.search).get("idSuc");

  const handleClose = (number: number) => {
    setAnchorEls(null);
    putCitaEstado(
      event.event_id,
      format(event.start, "yyyy-MM-dd HH:mm"),
      event.idCliente,
      event.tiempo,
      event.admin_id,
      event.idUsuario,
      number,
      idSuc
    ).then(() => window.location.reload());
  };

  const renderViewer = () => {
    const idKey = resourceFields.idField;
    const hasResource = resources.filter((res) =>
      Array.isArray(event[idKey]) ? event[idKey].includes(res[idKey]) : res[idKey] === event[idKey]
    );

    return (
      <PopperInner>
        <div
          style={{
            background: event.color || theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <div className="rs__popper_actions">
            <div>
              <IconButton
                size="small"
                onClick={() => {
                  triggerViewer();
                }}
              >
                <ClearRoundedIcon color="disabled" />
              </IconButton>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "end" }}>
              <EventActions
                event={event}
                onDelete={handleDelete}
                onEdit={() => {
                  triggerViewer();
                  triggerDialog(true, event);
                }}
                direction={direction}
                deletable={deletable}
                editable={editable}
              />
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <ChecklistIcon></ChecklistIcon>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEls}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {estatusCitas.map((estado) => (
                  <MenuItem key={estado.id} onClick={() => handleClose(estado.id)}>
                    {estado.descripcionEstatus}
                  </MenuItem>
                ))}
              </Menu>
              {event?.idEstatus === 4 ? (
                <IconButton
                  onClick={() => {
                    handleOpenVentas(
                      event?.idCliente ? Number(event?.idCliente) : 0,
                      event?.nombreCliente
                    );
                  }}
                >
                  <ShoppingCartIcon></ShoppingCartIcon>
                </IconButton>
              ) : null}
            </div>
          </div>
          {/* COMPONENTE CARD ON PRESS */}
          {viewerTitleComponent instanceof Function ? (
            viewerTitleComponent(event)
          ) : (
            <Typography style={{ padding: "5px 0", color: "black" }} noWrap>
              {event.description}
            </Typography>
          )}
        </div>
        {/* COMPONENTE CARD ON PRESS */}

        <div style={{ padding: "5px 10px" }}>
          <Typography
            style={{ display: "flex", alignItems: "center", gap: 8, color: "black" }}
            // color="textSecondary"
            variant="caption"
            noWrap
          >
            <EventNoteRoundedIcon />
            {hideDates
              ? translations.event.allDay
              : `${format(event.start, `dd MMMM yyyy ${hFormat}`, {
                  locale: locale,
                })} - ${format(event.end, `dd MMMM yyyy ${hFormat}`, {
                  locale: locale,
                })}`}
          </Typography>
          {hasResource.length > 0 && (
            <Typography
              style={{ display: "flex", alignItems: "center", gap: 8, color: "black" }}
              color="textSecondary"
              variant="caption"
              noWrap
            >
              <SupervisorAccountRoundedIcon />
              {hasResource.map((res) => res[resourceFields.textField]).join(", ")}
            </Typography>
          )}
          {viewerExtraComponent instanceof Function
            ? viewerExtraComponent(fields, event)
            : viewerExtraComponent}
        </div>
      </PopperInner>
    );
  };

  const isDraggable = useMemo(() => {
    // if Disabled
    if (event.disabled) return false;

    // global-wise isDraggable
    let canDrag = typeof draggable !== "undefined" ? draggable : true;
    // Override by event-wise
    if (typeof event.draggable !== "undefined") {
      canDrag = event.draggable;
    }

    return canDrag;
  }, [draggable, event.disabled, event.draggable]);

  const renderEvent = useMemo(() => {
    // Check if has custom render event method
    // only applicable to non-multiday events and not in month-view
    if (typeof eventRenderer === "function" && !multiday && view !== "month") {
      const custom = eventRenderer({
        event,
        onClick: triggerViewer,
        ...dragProps,
        event_id: undefined,
        start: undefined,
        title: undefined,
        end: undefined,
      });
      if (custom) {
        return (
          <EventItemPapper
            key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}
          >
            {custom}
          </EventItemPapper>
        );
      }
    }

    let item = (
      <div style={{ padding: "2px 6px" }}>
        <Typography style={{ fontSize: 11, color: "black" }} noWrap>
          {`${event.description} ${event.idEstatus !== 4 ? "" : event.ServicioDescripción} `}
        </Typography>
        <Typography style={{ fontSize: 11, color: "black" }} noWrap>
          {`${event.numeroTelefono}`}
        </Typography>

        {showdate && (
          <Typography style={{ fontSize: 11, color: "black" }} noWrap>
            {`${format(event.start, hFormat, {
              locale,
            })} - ${format(event.end, hFormat, { locale })} `}
          </Typography>
        )}
        {showdate && (
          <Typography variant="subtitle2" style={{ fontSize: 12 }} noWrap>
            {/* {event.title} */}
          </Typography>
        )}
      </div>
    );
    if (multiday) {
      item = (
        <div
          style={{
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 11 }} noWrap>
            {hasPrev ? (
              <PrevArrow fontSize="small" sx={{ display: "flex" }} />
            ) : (
              showdate && !hideDates && format(event.start, hFormat, { locale })
            )}
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ fontSize: 12 }} noWrap>
            {event.title}
          </Typography>
          <Typography sx={{ fontSize: 11 }} noWrap>
            {hasNext ? (
              <NextArrow fontSize="small" sx={{ display: "flex" }} />
            ) : (
              showdate && !hideDates && format(event.end, hFormat, { locale })
            )}
          </Typography>
        </div>
      );
    }
    return (
      <EventItemPapper
        key={`${event.start.getTime()}_${event.end.getTime()}_${event.event_id}`}
        color={event.color}
        disabled={event.disabled}
      >
        <ButtonBase
          onClick={(e: MouseEvent<Element, globalThis.MouseEvent> | undefined | any) => {
            e.preventDefault();
            e.stopPropagation();
            triggerViewer(e);
            if (typeof onEventClick === "function") {
              onEventClick(event);
            }
          }}
          disabled={event.disabled}
        >
          <div {...dragProps} draggable={isDraggable}>
            {item}
          </div>
        </ButtonBase>
      </EventItemPapper>
    );
    // eslint-disable-next-line
  }, [hasPrev, hasNext, event, isDraggable, locale, theme.palette]);

  return (
    <Fragment>
      {renderEvent}

      {/* Viewer */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          triggerViewer();
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {typeof customViewer === "function"
          ? customViewer(event, () => triggerViewer())
          : renderViewer()}
      </Popover>
    </Fragment>
  );
};

EventItem.defaultProps = {
  multiday: false,
  showdate: true,
};

export default EventItem;
