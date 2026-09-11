import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  ComboboxInput,
} from "@/components/ui/combobox";

export function ExampleComboboxMultiple({
  items = [],
  value = [],
  setValue,
  placeholder = "Select status...",
}) {
  return (
    <Combobox
      items={items}
      itemToStringValue={(item) => item.label}
      multiple
      value={value}
      onValueChange={setValue}
    >
      <ComboboxChips>
        <ComboboxValue>
          {value.map((selectedVal) => {
            const foundItem = items.find(
              (i) => i.value === selectedVal || i === selectedVal,
            );
            const displayLabel = foundItem?.label || selectedVal;

            return (
              <ComboboxChip key={selectedVal} value={selectedVal}>
                {displayLabel}
              </ComboboxChip>
            );
          })}
        </ComboboxValue>
        <ComboboxChipsInput placeholder={placeholder} />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function ComboboxBasic({ items = [], placeholder, value, setValue }) {
  return (
    <Combobox items={items}>
      <ComboboxInput
        placeholder={placeholder}
        value={value}
        onValueChange={setValue}
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
