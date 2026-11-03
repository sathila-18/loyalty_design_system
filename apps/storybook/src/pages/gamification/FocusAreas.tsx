import { useState } from 'react';
import { FinAppShell, FinDialog, FinEmptyState, FinTable, type FinTableColumn, type FinTableFilters } from '@finspace-loyalty/ui';
import { NOT_AVAILABLE } from '../common/format';
import { useBackOnline, useFlakyCall, usePageLoad, usePageNotices, type PageApi } from '../common/pageApi';
import { ConnectionError, LoadError, PageNotices } from '../common/PageStates';
import pageStyles from '../common/PageStates.module.css';
import { LevelLink, LevelLinkProvider } from '../LevelLink';
import { PAGE_TABLE_VARIANT, usePageSideNav } from '../pageShell';
import { RecordDetails } from '../RecordDetails';
import { FocusAreaForm } from './FocusAreaForm';
import { count, nextId, padded, placeAt, removeFrom, type FocusArea, type Lesson, type Question } from './focusAreaModel';
import { LessonForm } from './LessonForm';
import { QuestionForm } from './QuestionForm';

export interface FocusAreasProps {
  focusAreas: FocusArea[];
  /** Start in a focus area's lessons (its `id`), or a lesson's questions too (`lessonId`). Default: the focus areas. */
  initialLevel?: { areaId: number; lessonId?: number };
  /** Called with what the admin did, so stories can show it. */
  onAction?: (action: string) => void;
  /** The fake API: loading, failures and the connection (Pages/Common states). Default: everything works at once. */
  api?: PageApi;
}

type Status = 'Draft' | 'Published';
const statusOf = (item: { published: boolean }): Status => (item.published ? 'Published' : 'Draft');
const statusColumn = <Row extends { published: boolean }>(): FinTableColumn<Row> => ({
  key: 'status',
  header: 'Status',
  width: 176,
  type: 'badge',
  value: statusOf,
  badgeTone: (r) => (r.published ? 'success' : 'secondary'),
  filter: { options: (['Draft', 'Published'] as const).map((s) => ({ value: s, label: s })), value: statusOf },
});


const areaHref = (area: FocusArea) => `#gamification/focus/${area.id}`;
const lessonHref = (areaId: number, lesson: Lesson) => `#gamification/focus/${areaId}/lessons/${lesson.id}`;
const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);

type Removing =
  | { kind: 'focus area'; item: FocusArea; open: boolean }
  | { kind: 'lesson'; item: Lesson; open: boolean }
  | { kind: 'question'; item: Question; open: boolean };

/**
 * Pages → Gamification → Focus areas (Figma section `57:13928`, DESIGN.md §8.6): three lists, each in the app shell
 * and built as the other list pages (search, a Status column filter, the ⋮ menu, add / edit side sheets, a remove
 * dialog and snackbar, empty states, the Common states). **Focus areas** (`413:39213`) → View, a row click or its
 * lessons link opens its **lessons** (`420:42435`) → View, a row click or its questions link opens its **questions**
 * (`420:45368`) → View or a row click opens the question's details (decided 28 Oct 2026). The header's back button
 * goes up a level.
 */
export function FocusAreas({ focusAreas, initialLevel, onAction = () => undefined, api = {} }: FocusAreasProps) {
  const sideNav = usePageSideNav('#gamification/focus');
  const [areas, setAreas] = useState(focusAreas);
  const [level, setLevel] = useState<{ areaId: number | null; lessonId: number | null }>({
    areaId: initialLevel?.areaId ?? null,
    lessonId: initialLevel?.lessonId ?? null,
  });
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FinTableFilters>({});
  // Each Add or Edit starts a fresh form (the sheet remounts); the sheet keeps its item while it closes.
  const [areaForm, setAreaForm] = useState<{ key: number; open: boolean; area?: FocusArea }>({ key: 0, open: false });
  const [lessonForm, setLessonForm] = useState<{ key: number; open: boolean; lesson?: Lesson }>({ key: 0, open: false });
  const [questionForm, setQuestionForm] = useState<{ key: number; open: boolean; question?: Question }>({ key: 0, open: false });
  const [viewing, setViewing] = useState<Question | null>(null);
  const [removing, setRemoving] = useState<Removing | null>(null);
  const { notices, notify, dismiss } = usePageNotices();
  const { status, retry } = usePageLoad(api.load);
  const online = api.online ?? true;
  const saveCall = useFlakyCall(api.save);
  const removeCall = useFlakyCall(api.remove);
  useBackOnline(online, () => notify({ text: "You're back online", tone: 'success' }));

  const area = areas.find((a) => a.id === level.areaId) ?? null;
  const lesson = area?.lessons.find((l) => l.id === level.lessonId) ?? null;
  const questions = lesson?.questions ?? [];

  const go = (areaId: number | null, lessonId: number | null = null) => {
    setLevel({ areaId, lessonId });
    setQuery('');
    setFilters({});
    setViewing(null);
  };
  const navigate = (href: string) => {
    const [, areaId, lessonId] = href.match(/focus\/(\d+)(?:\/lessons\/(\d+))?/) ?? [];
    if (areaId) go(Number(areaId), lessonId ? Number(lessonId) : null);
  };
  const openArea = (a: FocusArea) => {
    onAction(`View: ${a.name}`);
    go(a.id);
  };
  const openLesson = (l: Lesson) => {
    onAction(`View: ${l.topic}`);
    go(level.areaId, l.id);
  };

  /** Changes the open focus area's lessons. */
  const updateLessons = (change: (lessons: Lesson[]) => Lesson[]) =>
    setAreas((current) => current.map((a) => (a.id === level.areaId ? { ...a, lessons: change(a.lessons) } : a)));
  /** Changes the open lesson's questions. */
  const updateQuestions = (change: (questions: Question[]) => Question[]) =>
    updateLessons((lessons) => lessons.map((l) => (l.id === level.lessonId ? { ...l, questions: change(l.questions) } : l)));

  const search = query.trim().toLowerCase();
  const searched = query.trim();
  const matches = (text: string) => text.toLowerCase().includes(search);

  const areaColumns: FinTableColumn<FocusArea>[] = [
    { key: 'order', header: 'Order', width: 120, value: (a) => padded(a.order) },
    { key: 'name', header: 'Focus area', minWidth: 240 },
    { key: 'lessons', header: 'Lessons', width: 200, type: 'link', value: (a) => count(a.lessons.length, 'lesson', 'lessons'), href: areaHref, linkAs: LevelLink },
    statusColumn<FocusArea>(),
  ];
  const lessonColumns: FinTableColumn<Lesson>[] = [
    { key: 'order', header: 'Order', width: 120, value: (l) => padded(l.order) },
    { key: 'topic', header: 'Lesson topic', minWidth: 240 },
    {
      key: 'questions',
      header: 'Questions',
      width: 200,
      type: 'link',
      value: (l) => count(l.questions.length, 'question', 'questions'),
      href: (l) => lessonHref(level.areaId ?? 0, l),
      linkAs: LevelLink,
    },
    statusColumn<Lesson>(),
  ];
  const questionNo = (q: Question) => padded(questions.indexOf(q) + 1);
  const questionColumns: FinTableColumn<Question>[] = [
    { key: 'no', header: 'No.', width: 120, value: questionNo },
    { key: 'text', header: 'Question', minWidth: 280 },
    { key: 'options', header: 'Options', width: 160, value: (q) => String(q.options.length) },
    { key: 'points', header: 'Points', width: 160, value: (q) => `${q.points} pts` },
  ];
  // The details sheet shows more than the list: every option, the correct one, tiers and the explanation.
  const questionDetails: FinTableColumn<Question>[] = [
    questionColumns[0]!,
    questionColumns[1]!,
    { key: 'options', header: 'Answer options', value: (q) => q.options.map((o) => o.text).join(', ') },
    { key: 'correct', header: 'Correct option', value: (q) => q.options.find((o) => o.id === q.correct)?.text ?? NOT_AVAILABLE },
    { key: 'tiers', header: 'Tiers', value: (q) => (q.tiers.length ? q.tiers.join(', ') : NOT_AVAILABLE) },
    { key: 'explanation', header: 'Explanation', value: (q) => q.explanation },
    questionColumns[3]!,
  ];

  const askRemove = (target: Removing) => {
    onAction(`Remove: ${target.kind === 'focus area' ? target.item.name : target.kind === 'lesson' ? target.item.topic : target.item.text}`);
    setViewing(null);
    setRemoving(target);
  };
  const closeRemove = () => setRemoving((current) => current && { ...current, open: false });
  const remove = (target: Removing) => {
    const Item = target.kind === 'focus area' ? 'Focus area' : target.kind === 'lesson' ? 'Lesson' : 'Question';
    if (!removeCall()) {
      notify({ text: `Couldn't remove the ${target.kind}`, tone: 'error', action: { label: 'Try again', onClick: () => remove(target) } });
      return;
    }
    if (target.kind === 'focus area') setAreas((current) => removeFrom(current, target.item.id));
    else if (target.kind === 'lesson') updateLessons((lessons) => removeFrom(lessons, target.item.id));
    else updateQuestions((qs) => qs.filter((q) => q.id !== target.item.id));
    notify({ text: `${Item} removed successfully`, tone: 'success' });
  };
  const removeBody = (target: Removing | null) => {
    if (!target) return '';
    if (target.kind === 'focus area') {
      const n = target.item.lessons.length;
      return `Are you sure you want to remove the “${target.item.name}” focus area?${n ? ` Its ${count(n, 'lesson', 'lessons')} will be removed too.` : ''}`;
    }
    if (target.kind === 'lesson') {
      const n = target.item.questions.length;
      return `Are you sure you want to remove the “${target.item.topic}” lesson?${n ? ` Its ${count(n, 'question', 'questions')} will be removed too.` : ''}`;
    }
    return `Are you sure you want to remove the question “${target.item.text}”?`;
  };

  const clear = () => {
    setQuery('');
    setFilters({});
  };
  const noMatches = (items: string) => (
    <FinEmptyState
      size="small"
      icon="search"
      heading={searched ? `No ${items} match “${searched}”` : `No ${items} match the filter`}
      description={searched ? 'Check the spelling, or clear the search and filters.' : `Clear the filter to see every ${items.replace(/s$/, '').replace(/ie$/, 'y')}.`}
      action={{ label: searched ? 'Clear search and filters' : 'Clear filter', onClick: clear }}
    />
  );
  const toolbar = (label: string, placeholder: string, action: string, onAdd: () => void) =>
    ({
      search: { label, placeholder, value: query, onChange: (e: { target: { value: string } }) => setQuery(e.target.value) },
      actionLabel: action,
      onAction: onAdd,
      actionDisabled: !online,
    }) as const;

  const addArea = () => {
    onAction('Add focus area');
    setAreaForm((c) => ({ key: c.key + 1, open: true }));
  };
  const editArea = (a: FocusArea) => {
    onAction(`Edit: ${a.name}`);
    setAreaForm((c) => ({ key: c.key + 1, open: true, area: a }));
  };
  const addLesson = () => {
    onAction('Add lesson');
    setLessonForm((c) => ({ key: c.key + 1, open: true }));
  };
  const editLesson = (l: Lesson) => {
    onAction(`Edit: ${l.topic}`);
    setLessonForm((c) => ({ key: c.key + 1, open: true, lesson: l }));
  };
  const addQuestion = () => {
    onAction('Add question');
    setQuestionForm((c) => ({ key: c.key + 1, open: true }));
  };
  const editQuestion = (q: Question) => {
    onAction(`Edit: ${q.text}`);
    setViewing(null);
    setQuestionForm((c) => ({ key: c.key + 1, open: true, question: q }));
  };

  let header;
  let table;
  if (area && lesson) {
    const rows = questions.filter((q) => matches(q.text));
    header = { heading: lesson.topic, bodyContent: `Focus areas › ${area.name} › Questions`, backButton: true, onBack: () => go(area.id), backLabel: 'Back to lessons' };
    table = (
      <FinTable
        // A new table per level, so it starts scrolled to the left (not where the last level was scrolled).
        key={`questions-${lesson.id}`}
        label="Questions"
        variant={PAGE_TABLE_VARIANT}
        columns={questionColumns}
        rows={rows}
        getRowId={(q) => q.id}
        getRowLabel={(q) => q.text}
        onRowClick={setViewing}
        rowActions={(q) => [
          { label: 'View', icon: 'visibility', onSelect: () => setViewing(q) },
          { label: 'Edit', icon: 'edit', onSelect: () => editQuestion(q), disabled: !online },
          { label: 'Remove', icon: 'delete', onSelect: () => askRemove({ kind: 'question', item: q, open: true }), separator: true, destructive: true, disabled: !online },
        ]}
        toolbar={toolbar('Search question', 'Search question', 'Add question', addQuestion)}
        empty={
          questions.length === 0 ? (
            <FinEmptyState
              icon="sports_esports"
              heading="No questions yet"
              description="Add a question to check what members learnt in this lesson."
              action={{ label: 'Add question', leadingIcon: 'add', onClick: addQuestion }}
            />
          ) : (
            noMatches('questions')
          )
        }
      />
    );
  } else if (area) {
    const rows = byOrder(area.lessons).filter((l) => matches(l.topic));
    header = { heading: area.name, bodyContent: 'Focus areas › Lessons', backButton: true, onBack: () => go(null), backLabel: 'Back to focus areas' };
    table = (
      <FinTable
        key={`lessons-${area.id}`}
        label="Lessons"
        variant={PAGE_TABLE_VARIANT}
        columns={lessonColumns}
        rows={rows}
        getRowId={(l) => l.id}
        getRowLabel={(l) => l.topic}
        onRowClick={openLesson}
        rowActions={(l) => [
          { label: 'View', icon: 'visibility', onSelect: () => openLesson(l) },
          { label: 'Edit', icon: 'edit', onSelect: () => editLesson(l), disabled: !online },
          { label: 'Remove', icon: 'delete', onSelect: () => askRemove({ kind: 'lesson', item: l, open: true }), separator: true, destructive: true, disabled: !online },
        ]}
        toolbar={toolbar('Search lesson', 'Search lesson', 'Add lesson', addLesson)}
        filters={filters}
        onFiltersChange={setFilters}
        empty={
          area.lessons.length === 0 ? (
            <FinEmptyState
              icon="sports_esports"
              heading="No lessons yet"
              description={`Add a lesson to teach members about ${area.name.toLowerCase()}.`}
              action={{ label: 'Add lesson', leadingIcon: 'add', onClick: addLesson }}
            />
          ) : (
            noMatches('lessons')
          )
        }
      />
    );
  } else {
    const rows = byOrder(areas).filter((a) => matches(a.name));
    header = { heading: 'Focus areas', bodyContent: 'Topics members learn about, in lessons and questions', backButton: false };
    table = (
      <FinTable
        key="focus-areas"
        label="Focus areas"
        variant={PAGE_TABLE_VARIANT}
        columns={areaColumns}
        rows={status === 'ready' ? rows : []}
        loading={status === 'loading'}
        getRowId={(a) => a.id}
        getRowLabel={(a) => a.name}
        onRowClick={openArea}
        rowActions={(a) => [
          { label: 'View', icon: 'visibility', onSelect: () => openArea(a) },
          { label: 'Edit', icon: 'edit', onSelect: () => editArea(a), disabled: !online },
          { label: 'Remove', icon: 'delete', onSelect: () => askRemove({ kind: 'focus area', item: a, open: true }), separator: true, destructive: true, disabled: !online },
        ]}
        // No toolbar until the list has loaded (decided 27 Oct 2026).
        {...(status === 'ready' ? { toolbar: toolbar('Search focus area', 'Search focus area', 'Add focus area', addArea) } : {})}
        filters={filters}
        onFiltersChange={setFilters}
        empty={
          status === 'error' ? (
            <LoadError items="focus areas" onRetry={retry} />
          ) : areas.length === 0 ? (
            <FinEmptyState
              icon="sports_esports"
              heading="No focus areas yet"
              description="Add a focus area: a topic members learn about, in lessons and questions."
              action={{ label: 'Add focus area', leadingIcon: 'add', onClick: addArea }}
            />
          ) : (
            noMatches('focus areas')
          )
        }
      />
    );
  }

  const saved = (item: string, editing: boolean) => notify({ text: `${item} ${editing ? 'saved' : 'added'} successfully`, tone: 'success' });

  return (
    <LevelLinkProvider navigate={navigate}>
      <FinAppShell sideNav={sideNav} header={{ ...header, notificationProps: { notification: 'number', count: 120 } }}>
        <div className={pageStyles.page}>
          {!online && <ConnectionError />}
          {table}
        </div>
        <FocusAreaForm
          key={`area-${areaForm.key}`}
          open={areaForm.open}
          {...(areaForm.area ? { area: areaForm.area } : {})}
          total={areas.length}
          offline={!online}
          onClose={() => setAreaForm((c) => ({ ...c, open: false }))}
          onSave={(values) => {
            if (!saveCall()) return false;
            const editing = areaForm.area;
            setAreas((current) => placeAt(current, editing ? { ...editing, ...values } : { id: nextId(current), lessons: [], ...values }, values.order));
            onAction(`Saved: ${values.name}`);
            saved('Focus area', !!editing);
          }}
        />
        {area && (
          <LessonForm
            key={`lesson-${lessonForm.key}`}
            open={lessonForm.open}
            {...(lessonForm.lesson ? { lesson: lessonForm.lesson } : {})}
            focusArea={area.name}
            total={area.lessons.length}
            offline={!online}
            onClose={() => setLessonForm((c) => ({ ...c, open: false }))}
            onSave={(values) => {
              if (!saveCall()) return false;
              const editing = lessonForm.lesson;
              updateLessons((lessons) => placeAt(lessons, editing ? { ...editing, ...values } : { id: nextId(lessons), questions: [], ...values }, values.order));
              onAction(`Saved: ${values.topic}`);
              saved('Lesson', !!editing);
            }}
          />
        )}
        {lesson && (
          <QuestionForm
            key={`question-${questionForm.key}`}
            open={questionForm.open}
            {...(questionForm.question ? { question: questionForm.question } : {})}
            lesson={lesson.topic}
            offline={!online}
            onClose={() => setQuestionForm((c) => ({ ...c, open: false }))}
            onSave={(values) => {
              if (!saveCall()) return false;
              const editing = questionForm.question;
              updateQuestions((qs) => (editing ? qs.map((q) => (q.id === editing.id ? { ...q, ...values } : q)) : [...qs, { id: nextId(qs), ...values }]));
              onAction(`Saved: ${values.text}`);
              saved('Question', !!editing);
            }}
          />
        )}
        <RecordDetails
          record={viewing}
          getName={(q) => `Question ${questionNo(q)}`}
          columns={questionDetails}
          onClose={() => setViewing(null)}
          onEdit={editQuestion}
          onRemove={(q) => askRemove({ kind: 'question', item: q, open: true })}
          actionsDisabled={!online}
        />
        <FinDialog
          open={removing?.open ?? false}
          onClose={closeRemove}
          title={`Remove ${removing?.kind ?? 'item'}`}
          secondaryButton={{ label: 'Cancel', onClick: closeRemove }}
          primaryButton={{
            label: 'Remove',
            tone: 'destructive',
            onClick: () => {
              if (!removing) return;
              closeRemove();
              remove(removing);
            },
          }}
        >
          {removeBody(removing)}
        </FinDialog>
        <PageNotices notices={notices} onDismiss={dismiss} />
      </FinAppShell>
    </LevelLinkProvider>
  );
}
